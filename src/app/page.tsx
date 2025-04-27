import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js

export default function HomePage() {
  const features = [
    {
      title: '🚀 AI-Powered Roadmaps',
      description:
        'No more guessing where to start. SkillUp AI generates personalized learning roadmaps based on your goals and current knowledge. Our AI adapts to your progress and ensures you always know what to learn next.'
    },
    {
      title: '📚 Create and Track Courses',
      description:
        'Create your own courses or explore a vast library of curated content. With SkillUp AI, you can organize your lessons, track your progress, and stay motivated with a clear path forward.',
    },
    {
      title: '📝 Seamless Note-Taking and Progress Tracking',
      description:
        'Keep all your insights in one place! SkillUp AI automatically tracks your progress and lets you take notes directly within the platform. Stay organized and review your journey at any time.',
    },
    {
      title: '📧 Daily Email Digest',
      description:
        'Stay on top of your learning with daily email summaries of your notes, progress, and key takeaways. Never miss a step in your growth journey.',
    },
    {
      title: '🔒 Security and Privacy First',
      description:
        'Your learning experience is personal, and we take that seriously. With advanced encryption and secure authentication, your data is always safe with us.',
    },
  ];

  return (
    <div className="items-center justify-center">
      <div className="w-full flex flex-col justify-center items-center">
        {/* Replace <img> with <Image> from next/image */}
        <Image
          src="/logo.png" // Path to your image
          alt="SkillUp AI Logo" // Alt text for accessibility
          className="h-auto w-auto"
          width={500} // Set an explicit width for optimization
          height={500} // Set an explicit height for optimization
          priority // Optional: This helps with critical images (like the logo)
        />
      </div>

      <div className="flex flex-col items-center p-8 space-y-4">
        <h2 className="text-4xl font-semibold text-white-700">
          Your personalized learning path with AI-powered course recommendations.
        </h2>
        <div className="flex justify-center items-center min-h-screen bg-white-100">
          <div className="p-8 max-w-4xl w-full">
            <h1 className="text-3xl text-white-500 font-bold mb-6 text-center">
              Welcome to SkillUp AI: Your Personalized Learning Journey Starts Here
            </h1>
            <p className="text-lg text-white-700 mb-6 text-center">
              Unlock your full potential with SkillUp AI, the ultimate platform for personalized learning.
              Whether you&apos;re looking to advance your career, master a new skill, or simply explore new knowledge,
              SkillUp AI provides the tools you need to succeed.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div>
                    <h3 className="text-xl text-white-800 font-semibold">{feature.title}</h3>
                    <p className="text-white-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-lg text-white-700 my-8 text-center">
              Join the Learning Revolution. Don&apos;t just learn, learn smarter with SkillUp AI. Start your journey today
              and unlock the best version of yourself.
            </p>

            <a
              href="#signup"
              className="block text-xl text-center py-3 px-6 text-white font-semibold rounded-lg transition duration-300"
            >
              👉 Sign Up Now to get started!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
