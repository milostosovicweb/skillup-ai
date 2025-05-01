import React from 'react';
// import Image from 'next/image';

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
        {/* <Image
          src="/logo.png" // Path to your image
          alt="SkillUp AI Logo" // Alt text for accessibility
          className="h-auto w-auto"
          width={500} // Set an explicit width for optimization
          height={500} // Set an explicit height for optimization
          priority // Optional: This helps with critical images (like the logo)
        /> */}
        <div className='w-full sm:w-1/2 px-2'>
          <svg width="auto" height="auto" viewBox="0 0 370.00000000000006 60.73786686308818"><defs id="SvgjsDefs1011"></defs><g id="SvgjsG1012" transform="matrix(0.701199087245294,0,0,0.701199087245294,-0.07643017623673785,-5.517732578889713)" fill="#75C2F6"><g xmlns="http://www.w3.org/2000/svg"><path d="M89.633,72.435H79L67.251,84.184L56.062,72.435H10.414V18.173h79.219V72.435z M10.414,7.869   c-5.692,0-10.305,4.614-10.305,10.305v54.261c0,5.69,4.613,10.306,10.305,10.306h41.23l8.145,8.552   c1.913,2.012,4.561,3.162,7.335,3.196c0.042,0,0.085,0,0.127,0c2.73,0,5.352-1.084,7.284-3.017l8.733-8.731h6.363   c5.689,0,10.305-4.615,10.305-10.306l0.002-54.261c0-5.691-4.612-10.305-10.305-10.305H10.414z"></path><g><path fill="#D2FF72" d="M38.547,40.832h0.014l0.012,0c2.979-0.08,5.059-2.064,5.059-4.825c0-2.833-2.139-4.889-5.084-4.889    c-2.862,0-5.021,2.074-5.021,4.825C33.526,38.775,35.638,40.832,38.547,40.832z"></path><path fill="#D2FF72" d="M61.435,40.832h0.014l0.014,0c2.978-0.08,5.056-2.064,5.056-4.825c0-2.833-2.137-4.889-5.083-4.889    c-2.861,0-5.021,2.074-5.021,4.825C56.414,38.775,58.526,40.832,61.435,40.832z"></path><path fill="#D2FF72" d="M79.31,41.996c-1.26-1.163-3.405-1.077-4.569,0.183c-6.662,7.231-16.252,11.215-26.09,10.818    c-8.968-0.361-17.258-4.196-23.346-10.799c-1.162-1.258-3.306-1.347-4.567-0.184c-1.31,1.209-1.393,3.259-0.185,4.567    c7.254,7.869,17.141,12.442,27.835,12.878c0.542,0.022,1.079,0.032,1.617,0.032c0.58,0,1.157-0.013,1.736-0.036    C62.396,59,72.25,54.42,79.494,46.561c0.584-0.635,0.889-1.459,0.854-2.322C80.312,43.376,79.94,42.579,79.31,41.996z"></path></g></g></g><g id="SvgjsG1013" transform="matrix(3.2310173496071433,0,0,3.2310173496071433,89.03069726018846,-11.059772283820134)" fill="#DDDDDD"><path d="M0.3 18.82 q0.06 -0.66 0.41 -1.32 t0.83 -1.08 q2.14 1.3 4.06 1.3 q0.84 0 1.23 -0.38 t0.39 -0.94 q0 -0.94 -1.26 -1.48 l-2.36 -1 q-1.38 -0.62 -2.12 -1.49 t-0.74 -2.21 q0 -0.92 0.37 -1.68 t1.04 -1.32 t1.59 -0.87 t2.04 -0.31 q2.24 0 4.52 1.14 q-0.1 1.54 -1.08 2.4 q-2.04 -0.98 -3.6 -0.98 q-0.8 0 -1.2 0.36 t-0.4 0.82 q0 0.78 1.18 1.26 l2.4 1.02 q1.52 0.64 2.27 1.64 t0.75 2.32 q0 0.94 -0.34 1.72 t-1.01 1.35 t-1.67 0.89 t-2.34 0.32 q-2.6 0 -4.96 -1.48 z M20 16.02 l0.5 1.46 q0.4 1.32 0.96 1.7 q-0.88 0.98 -2.1 0.98 q-0.66 0 -1 -0.31 t-0.6 -1.09 l-0.6 -1.72 q-0.2 -0.62 -0.46 -0.83 t-0.7 -0.21 t-0.62 0.02 l0 3.98 q-0.66 0.12 -1.52 0.12 t-1.52 -0.12 l0 -14.58 l0.14 -0.14 l1.2 0 q0.94 0 1.32 0.42 t0.38 1.46 l0 6.28 l0.32 0 q0.36 0 0.56 -0.36 l1.04 -2 q0.56 -1.14 1.76 -1.14 q0.58 0 1.74 0.04 l0.12 0.16 l-1.54 2.98 q-0.4 0.76 -1.02 1.18 q1.2 0.44 1.64 1.72 z M26.3 12.32 l0 7.68 q-0.34 0.06 -0.74 0.09 t-0.82 0.03 t-0.83 -0.03 t-0.75 -0.09 l0 -6.62 q0 -1.16 -0.94 -1.16 l-0.3 0 q-0.12 -0.38 -0.12 -1.06 q0 -0.66 0.12 -1.12 q0.52 -0.04 0.96 -0.07 t0.8 -0.03 l0.44 0 q1.02 0 1.6 0.64 t0.58 1.74 z M22.8 6 q0.58 -0.32 1.5 -0.32 q0.94 0 1.46 0.32 q0.24 0.54 0.24 1.16 t-0.24 1.16 q-0.58 0.3 -1.52 0.3 t-1.44 -0.3 q-0.24 -0.54 -0.24 -1.16 t0.24 -1.16 z M32.56 17.72 l0.54 0 q0.24 0.66 0.24 1.32 t-0.06 0.86 q-1.2 0.2 -2.14 0.2 q-1.36 0 -1.93 -0.67 t-0.57 -2.11 l0 -11.9 l0.12 -0.14 l1.22 0 q0.94 0 1.32 0.42 t0.38 1.46 l0 9.62 q0 0.94 0.88 0.94 z M38.62 17.72 l0.54 0 q0.24 0.66 0.24 1.32 t-0.06 0.86 q-1.2 0.2 -2.14 0.2 q-1.36 0 -1.93 -0.67 t-0.57 -2.11 l0 -11.9 l0.12 -0.14 l1.22 0 q0.94 0 1.32 0.42 t0.38 1.46 l0 9.62 q0 0.94 0.88 0.94 z M51.919999999999995 6.34 l0 8.62 q0 2.56 -1.4 3.95 t-4 1.39 t-4.01 -1.39 t-1.41 -3.95 l0 -8.62 l0.14 -0.14 l1.18 0 q1.9 0 1.9 2.04 l0 6.76 q0 1.4 0.5 2.08 t1.7 0.68 t1.7 -0.68 t0.5 -2.08 l0 -8.66 q0.62 -0.12 1.6 -0.12 q0.96 0 1.6 0.12 z M59.53999999999999 15.719999999999999 l-1.58 0 l0 4.28 q-0.64 0.12 -1.6 0.12 q-0.98 0 -1.6 -0.12 l0 -13.56 l0.14 -0.14 q1.74 -0.04 2.89 -0.06 t1.75 -0.02 q1.1 0 2.01 0.3 t1.55 0.9 t0.99 1.49 t0.35 2.05 t-0.36 2.05 t-1 1.49 t-1.55 0.91 t-1.99 0.31 z M57.959999999999994 8.66 l0 4.66 q0.56 -0.02 0.89 -0.03 t0.43 -0.01 q0.54 0 0.9 -0.19 t0.58 -0.5 t0.32 -0.73 t0.1 -0.88 q0 -0.44 -0.1 -0.86 t-0.31 -0.74 t-0.55 -0.51 t-0.8 -0.19 l-0.82 0 t-0.64 -0.02 z M74.26 17.14 q-0.54 0 -0.8 -0.02 l-0.86 2.9 q-0.48 0.12 -1.34 0.12 q-0.96 0 -1.56 -0.22 l-0.1 -0.16 l4.4 -13.42 q0.78 -0.12 1.82 -0.12 q1.18 0 1.88 0.14 l4.32 13.44 q-0.7 0.38 -1.58 0.38 q-1.04 0 -1.46 -0.36 t-0.72 -1.38 l-0.38 -1.32 q-0.26 0.02 -0.78 0.02 l-2.84 0 z M74.2 14.620000000000001 l0.8 -0.02 l1.46 0 q0.1 0 0.35 0.01 t0.37 0.01 l-0.34 -1.24 q-0.48 -1.68 -1.1 -4.12 l-0.12 0 q-0.16 0.86 -0.96 3.82 z M83.74000000000001 20 l0 -13.66 q0.62 -0.12 1.6 -0.12 t1.62 0.12 l0 13.66 q-0.64 0.12 -1.62 0.12 t-1.6 -0.12 z"></path></g></svg>
        </div>
      </div>

      <div className="flex flex-col items-center p-8 space-y-4">
        <h1 className="text-3xl text-white-500 font-bold mb-4 text-center">
          Your personalized learning path with AI-powered course recommendations.
        </h1>
        <div className="flex justify-center items-center min-h-screen bg-white-100">
          <div className="p-8 max-w-4xl w-full">
            <p className="text-xl text-white-700 mb-6 text-center">
              Unlock your full potential with SkillUp AI, the ultimate platform for personalized learning.
              Whether you&apos;re looking to advance your career, master a new skill, or simply explore new knowledge,
              SkillUp AI provides the tools you need to succeed.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 gap-x-4 rounded-2xl shadow-lg bg-[#222831] p-6">
                  <div>
                    <h3 className="text-2xl text-white-800 font-semibold">{feature.title}</h3>
                    <p className="text-xl text-white-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-2xl text-white-700 my-8 text-center">
              Join the Learning Revolution. Don&apos;t just learn, learn smarter with SkillUp AI. Start your journey today
              and unlock the best version of yourself.
            </p>

            <a
              href="#signup"
              className="block text-3xl text-center py-3 px-6 text-white font-semibold rounded-lg transition duration-300"
            >
              👉 Sign Up Now to get started!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
