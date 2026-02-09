//! Search command implementation

use anyhow::Result;
use colored::*;
use indicatif::{ProgressBar, ProgressStyle};
use serde::Deserialize;

#[derive(Deserialize)]
struct SearchResponse {
    total: u32,
    skills: Vec<SkillResult>,
}

#[derive(Deserialize)]
struct SkillResult {
    id: String,
    name: String,
    description: String,
    category: String,
    author: String,
}

pub async fn execute(
    api_url: &str,
    query: &str,
    category: Option<&str>,
    limit: u32,
) -> Result<()> {
    let pb = ProgressBar::new_spinner();
    pb.set_style(
        ProgressStyle::default_spinner()
            .template("{spinner:.purple} {msg}")
            .unwrap()
    );
    pb.set_message(format!("Searching for '{}'...", query));
    pb.enable_steady_tick(std::time::Duration::from_millis(100));

    // Build URL with query parameters
    let mut url = format!("{}/skills?query={}&limit={}", api_url, query, limit);
    if let Some(cat) = category {
        url.push_str(&format!("&category={}", cat));
    }

    // Make API request
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;
    
    pb.finish_and_clear();

    if response.status().is_success() {
        let data: SearchResponse = response.json().await?;
        
        println!("{} {} results for '{}'\n", 
            "Found".green().bold(), 
            data.total.to_string().yellow(),
            query.cyan()
        );

        if data.skills.is_empty() {
            println!("{}", "No skills found matching your query.".dimmed());
            return Ok(());
        }

        for (i, skill) in data.skills.iter().enumerate() {
            println!("{}. {} {}", 
                (i + 1).to_string().dimmed(),
                skill.name.bold(),
                format!("({})", skill.id).dimmed()
            );
            println!("   {} {}", "by".dimmed(), skill.author.cyan());
            println!("   {}", skill.description.dimmed());
            println!("   {} {}", "Category:".dimmed(), skill.category.yellow());
            println!();
        }

        println!("{}", format!("Run 'athena install <skill-id>' to install a skill").dimmed());
    } else {
        println!("{} Failed to search: {}", "Error:".red().bold(), response.status());
    }

    Ok(())
}
