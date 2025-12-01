import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Job } from '../models/Job.js';
import { Story } from '../models/Story.js';

dotenv.config();

const dummyAlumni = [
  { firstName: 'Jennifer', lastName: 'Parker', graduationYear: 2015, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Google', location: 'San Francisco, CA', industry: 'Technology' },
  { firstName: 'Michael', lastName: 'Chen', graduationYear: 2018, degree: 'Master of Science', major: 'Data Science', company: 'Microsoft', location: 'Seattle, WA', industry: 'Technology' },
  { firstName: 'Sarah', lastName: 'Johnson', graduationYear: 2016, degree: 'Bachelor of Arts', major: 'Business Administration', company: 'Amazon', location: 'Austin, TX', industry: 'E-commerce' },
  { firstName: 'David', lastName: 'Rodriguez', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Engineering', company: 'Tesla', location: 'Palo Alto, CA', industry: 'Automotive' },
  { firstName: 'Emily', lastName: 'Wang', graduationYear: 2019, degree: 'Master of Business Administration', major: 'Finance', company: 'Goldman Sachs', location: 'New York, NY', industry: 'Finance' },
  { firstName: 'James', lastName: 'Thompson', graduationYear: 2014, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Facebook', location: 'Menlo Park, CA', industry: 'Social Media' },
  { firstName: 'Lisa', lastName: 'Anderson', graduationYear: 2020, degree: 'Bachelor of Science', major: 'Biology', company: 'Pfizer', location: 'Boston, MA', industry: 'Pharmaceuticals' },
  { firstName: 'Robert', lastName: 'Brown', graduationYear: 2013, degree: 'Master of Science', major: 'Mechanical Engineering', company: 'Boeing', location: 'Seattle, WA', industry: 'Aerospace' },
  { firstName: 'Maria', lastName: 'Garcia', graduationYear: 2018, degree: 'Bachelor of Arts', major: 'Marketing', company: 'Nike', location: 'Portland, OR', industry: 'Retail' },
  { firstName: 'Kevin', lastName: 'Lee', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Netflix', location: 'Los Gatos, CA', industry: 'Entertainment' },
  { firstName: 'Amanda', lastName: 'Taylor', graduationYear: 2019, degree: 'Master of Science', major: 'Psychology', company: 'Uber', location: 'San Francisco, CA', industry: 'Transportation' },
  { firstName: 'Christopher', lastName: 'Martinez', graduationYear: 2016, degree: 'Bachelor of Science', major: 'Electrical Engineering', company: 'Intel', location: 'Santa Clara, CA', industry: 'Semiconductors' },
  { firstName: 'Jessica', lastName: 'Wilson', graduationYear: 2021, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Spotify', location: 'New York, NY', industry: 'Music Streaming' },
  { firstName: 'Daniel', lastName: 'Moore', graduationYear: 2015, degree: 'Master of Business Administration', major: 'Operations', company: 'Walmart', location: 'Bentonville, AR', industry: 'Retail' },
  { firstName: 'Ashley', lastName: 'Jackson', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Chemistry', company: 'Johnson & Johnson', location: 'New Brunswick, NJ', industry: 'Healthcare' },
  { firstName: 'Matthew', lastName: 'White', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Twitter', location: 'San Francisco, CA', industry: 'Social Media' },
  { firstName: 'Nicole', lastName: 'Harris', graduationYear: 2019, degree: 'Master of Science', major: 'Data Analytics', company: 'Airbnb', location: 'San Francisco, CA', industry: 'Hospitality' },
  { firstName: 'Andrew', lastName: 'Clark', graduationYear: 2016, degree: 'Bachelor of Science', major: 'Physics', company: 'SpaceX', location: 'Hawthorne, CA', industry: 'Aerospace' },
  { firstName: 'Rachel', lastName: 'Lewis', graduationYear: 2020, degree: 'Bachelor of Arts', major: 'Graphic Design', company: 'Adobe', location: 'San Jose, CA', industry: 'Software' },
  { firstName: 'Ryan', lastName: 'Walker', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Salesforce', location: 'San Francisco, CA', industry: 'CRM Software' },
  { firstName: 'Stephanie', lastName: 'Hall', graduationYear: 2017, degree: 'Master of Science', major: 'Biotechnology', company: 'Moderna', location: 'Cambridge, MA', industry: 'Biotechnology' },
  { firstName: 'Brandon', lastName: 'Allen', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Zoom', location: 'San Jose, CA', industry: 'Video Conferencing' },
  { firstName: 'Lauren', lastName: 'Young', graduationYear: 2016, degree: 'Bachelor of Arts', major: 'Communications', company: 'LinkedIn', location: 'Sunnyvale, CA', industry: 'Professional Networking' },
  { firstName: 'Tyler', lastName: 'King', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Slack', location: 'San Francisco, CA', industry: 'Collaboration Software' },
  { firstName: 'Megan', lastName: 'Wright', graduationYear: 2017, degree: 'Master of Business Administration', major: 'Strategy', company: 'McKinsey & Company', location: 'New York, NY', industry: 'Consulting' },
  { firstName: 'Jordan', lastName: 'Lopez', graduationYear: 2020, degree: 'Bachelor of Science', major: 'Computer Science', company: 'TikTok', location: 'Los Angeles, CA', industry: 'Social Media' },
  { firstName: 'Samantha', lastName: 'Hill', graduationYear: 2015, degree: 'Bachelor of Science', major: 'Mathematics', company: 'Palantir', location: 'Denver, CO', industry: 'Data Analytics' },
  { firstName: 'Justin', lastName: 'Scott', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Stripe', location: 'San Francisco, CA', industry: 'Fintech' },
  { firstName: 'Kayla', lastName: 'Green', graduationYear: 2018, degree: 'Master of Science', major: 'Environmental Science', company: 'Tesla', location: 'Austin, TX', industry: 'Clean Energy' },
  { firstName: 'Nathan', lastName: 'Adams', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Shopify', location: 'Ottawa, ON', industry: 'E-commerce Platform' },
  { firstName: 'Olivia', lastName: 'Baker', graduationYear: 2016, degree: 'Bachelor of Arts', major: 'International Relations', company: 'United Nations', location: 'New York, NY', industry: 'International Organization' },
  { firstName: 'Ethan', lastName: 'Gonzalez', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Discord', location: 'San Francisco, CA', industry: 'Gaming Communication' },
  { firstName: 'Hannah', lastName: 'Nelson', graduationYear: 2018, degree: 'Master of Science', major: 'Public Health', company: 'CDC', location: 'Atlanta, GA', industry: 'Public Health' },
  { firstName: 'Caleb', lastName: 'Carter', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'GitHub', location: 'San Francisco, CA', industry: 'Software Development' },
  { firstName: 'Grace', lastName: 'Mitchell', graduationYear: 2020, degree: 'Bachelor of Science', major: 'Neuroscience', company: 'Neuralink', location: 'Fremont, CA', industry: 'Neurotechnology' },
  { firstName: 'Zachary', lastName: 'Perez', graduationYear: 2016, degree: 'Master of Science', major: 'Artificial Intelligence', company: 'OpenAI', location: 'San Francisco, CA', industry: 'AI Research' },
  { firstName: 'Victoria', lastName: 'Roberts', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Pinterest', location: 'San Francisco, CA', industry: 'Social Media' },
  { firstName: 'Noah', lastName: 'Turner', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Coinbase', location: 'San Francisco, CA', industry: 'Cryptocurrency' },
  { firstName: 'Isabella', lastName: 'Phillips', graduationYear: 2017, degree: 'Master of Science', major: 'Data Science', company: 'Tableau', location: 'Seattle, WA', industry: 'Business Intelligence' },
  { firstName: 'Liam', lastName: 'Campbell', graduationYear: 2020, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Figma', location: 'San Francisco, CA', industry: 'Design Software' },
  { firstName: 'Sophia', lastName: 'Parker', graduationYear: 2016, degree: 'Bachelor of Arts', major: 'Journalism', company: 'The New York Times', location: 'New York, NY', industry: 'Media' },
  { firstName: 'William', lastName: 'Evans', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Reddit', location: 'San Francisco, CA', industry: 'Social Media' },
  { firstName: 'Ava', lastName: 'Edwards', graduationYear: 2019, degree: 'Master of Science', major: 'Biomedical Engineering', company: 'Medtronic', location: 'Minneapolis, MN', industry: 'Medical Devices' },
  { firstName: 'Benjamin', lastName: 'Collins', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Twitch', location: 'San Francisco, CA', industry: 'Live Streaming' },
  { firstName: 'Charlotte', lastName: 'Stewart', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Snapchat', location: 'Santa Monica, CA', industry: 'Social Media' },
  { firstName: 'Lucas', lastName: 'Sanchez', graduationYear: 2016, degree: 'Master of Science', major: 'Cybersecurity', company: 'CrowdStrike', location: 'Austin, TX', industry: 'Cybersecurity' },
  { firstName: 'Amelia', lastName: 'Morris', graduationYear: 2020, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Canva', location: 'Sydney, Australia', industry: 'Design Software' },
  { firstName: 'Henry', lastName: 'Rogers', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Notion', location: 'San Francisco, CA', industry: 'Productivity Software' },
  { firstName: 'Mia', lastName: 'Reed', graduationYear: 2017, degree: 'Master of Science', major: 'Machine Learning', company: 'Hugging Face', location: 'New York, NY', industry: 'AI/ML' },
  { firstName: 'Alexander', lastName: 'Cook', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Vercel', location: 'San Francisco, CA', industry: 'Web Development' },
  { firstName: 'Harper', lastName: 'Morgan', graduationYear: 2019, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Linear', location: 'San Francisco, CA', industry: 'Project Management' },
  { firstName: 'Mason', lastName: 'Bell', graduationYear: 2016, degree: 'Master of Science', major: 'Robotics', company: 'Boston Dynamics', location: 'Waltham, MA', industry: 'Robotics' },
  { firstName: 'Evelyn', lastName: 'Murphy', graduationYear: 2018, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Figma', location: 'San Francisco, CA', industry: 'Design Software' },
  { firstName: 'Logan', lastName: 'Bailey', graduationYear: 2017, degree: 'Bachelor of Science', major: 'Computer Science', company: 'Loom', location: 'San Francisco, CA', industry: 'Video Communication' }
];

async function run() {
	await connectToDatabase();
	
	// Create admin user
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
	let admin = await User.findOne({ email: adminEmail });
	if (!admin) {
		admin = await User.create({
			firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
			lastName: process.env.ADMIN_LAST_NAME || 'User',
			email: adminEmail,
			password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
			roles: ['admin', 'user'],
		});
		console.log('Admin user created:', admin.email);
	}

	// Create dummy alumni
	console.log('Creating dummy alumni...');
	for (const alumni of dummyAlumni) {
		const email = `${alumni.firstName.toLowerCase()}.${alumni.lastName.toLowerCase()}@alumni.edu`;
		const exists = await User.findOne({ email });
		if (!exists) {
			await User.create({
				...alumni,
				email,
				password: 'password123',
				headline: `${alumni.firstName} ${alumni.lastName} - ${alumni.company}`,
				bio: `Alumni from Class of ${alumni.graduationYear} with a ${alumni.degree} in ${alumni.major}. Currently working as a professional in ${alumni.industry} at ${alumni.company}.`,
			});
		}
	}
	console.log(`Created ${dummyAlumni.length} dummy alumni records`);

	// Create sample events (always add some upcoming events)
	const upcomingEvents = [
		{ title: 'Welcome Meetup', description: 'Kickoff event for new alumni', location: 'Campus Auditorium', datetime: new Date(Date.now() + 7*86400000), createdBy: admin._id },
		{ title: 'Tech Talk', description: 'Industry trends discussion', location: 'Virtual Event', datetime: new Date(Date.now() + 14*86400000), createdBy: admin._id },
		{ title: 'Networking Mixer', description: 'Connect with fellow alumni', location: 'Downtown Hotel', datetime: new Date(Date.now() + 21*86400000), createdBy: admin._id },
		{ title: 'Career Workshop', description: 'Resume building and interview tips', location: 'Career Center', datetime: new Date(Date.now() + 28*86400000), createdBy: admin._id },
	];
	
	for (const event of upcomingEvents) {
		const exists = await Event.findOne({ title: event.title, datetime: event.datetime });
		if (!exists) {
			await Event.create(event);
		}
	}
	console.log('Seeded events');

	// Create sample jobs
	if ((await Job.countDocuments()) === 0) {
		await Job.create([
			{ title: 'Software Engineer', company: 'Acme', location: 'Remote', description: 'Build features', postedBy: admin._id },
			{ title: 'Data Analyst', company: 'Globex', location: 'NYC', description: 'Analyze data', postedBy: admin._id },
		]);
		console.log('Seeded jobs');
	}

	// Create sample stories
	if ((await Story.countDocuments()) === 0) {
		try {
			await Story.create([
				{ author: admin._id, title: 'From Grad to Lead', content: 'My journey...', company: 'Acme', year: 2023, tags: ['career'] },
			]);
			console.log('Seeded stories');
		} catch (err) {
			console.log('Skipping stories due to index conflict');
		}
	}

	console.log('Seeding complete');
	process.exit(0);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
