import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

const sql = neon(process.env.DATABASE_URL)

async function deploySchema() {
  try {
    console.log("Reading schema file...")
    const schemaPath = path.join(process.cwd(), "scripts", "neon-schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    console.log("Deploying schema to Neon...")

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`)
        await sql`${statement}`
      }
    }

    console.log("✅ Schema deployed successfully!")
  } catch (error) {
    console.error("❌ Error deploying schema:", error)
    process.exit(1)
  }
}

deploySchema()
