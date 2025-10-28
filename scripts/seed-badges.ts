import { Badge } from '../src/models/Badge';
import dbConnect from '../src/lib/db';

const badges = [
  { badgeId: 'getting-started', title: 'Getting Started with Google Cloud', estimatedDuration: 60 },
  { badgeId: 'cloud-computing', title: 'Introduction to Cloud Computing', estimatedDuration: 120 },
  { badgeId: 'gcp-core', title: 'Google Cloud Platform Fundamentals', estimatedDuration: 180 },
  { badgeId: 'kubernetes', title: 'Getting Started with Kubernetes', estimatedDuration: 240 },
  { badgeId: 'app-engine', title: 'Developing Apps with App Engine', estimatedDuration: 180 },
  { badgeId: 'cloud-functions', title: 'Serverless with Cloud Functions', estimatedDuration: 120 },
  { badgeId: 'cloud-storage', title: 'Cloud Storage Essentials', estimatedDuration: 90 },
  { badgeId: 'bigquery', title: 'BigQuery for Data Analysis', estimatedDuration: 150 },
  { badgeId: 'cloud-sql', title: 'Managing Databases with Cloud SQL', estimatedDuration: 120 },
  { badgeId: 'networking', title: 'Cloud Networking Fundamentals', estimatedDuration: 180 },
  { badgeId: 'security', title: 'Cloud Security Best Practices', estimatedDuration: 210 },
  { badgeId: 'monitoring', title: 'Monitoring and Logging', estimatedDuration: 150 },
  { badgeId: 'devops', title: 'DevOps on Google Cloud', estimatedDuration: 240 },
  { badgeId: 'ml-apis', title: 'Machine Learning APIs', estimatedDuration: 180 },
  { badgeId: 'cloud-ai', title: 'AI Platform Fundamentals', estimatedDuration: 210 },
  { badgeId: 'data-engineering', title: 'Data Engineering Basics', estimatedDuration: 240 },
  { badgeId: 'cloud-architecture', title: 'Cloud Architecture Design', estimatedDuration: 300 },
  { badgeId: 'terraform', title: 'Infrastructure as Code with Terraform', estimatedDuration: 180 },
  { badgeId: 'cloud-run', title: 'Containerization with Cloud Run', estimatedDuration: 150 },
  { badgeId: 'advanced-security', title: 'Advanced Security Controls', estimatedDuration: 240 }
];

async function seedBadges() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Delete existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Insert new badges
    const result = await Badge.insertMany(badges);
    console.log(`Seeded ${result.length} badges successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
}

seedBadges();