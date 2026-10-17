
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page w-full bg-white text-[#1F1D3D]">
      <section id="home" className="landing-hero">
        {/* Animated school scene */}
        <div className="cs-scene" aria-hidden="true">
        {/* Sun */}
        <div className="cs-sun absolute rounded-full" />

        {/* Clouds */}
        <div className="cs-cloud cs-cloud-one">
          <span />
          <span />
        </div>

        <div className="cs-cloud cs-cloud-two">
          <span />
          <span />
        </div>

        <div className="cs-cloud cs-cloud-three">
          <span />
          <span />
        </div>

        {/* Hills */}
        <div className="cs-hill cs-hill-one" />
        <div className="cs-hill cs-hill-two" />

        {/* Trees */}
        <div className="cs-tree cs-tree-one">
          <span />
          <span />
        </div>

        <div className="cs-tree cs-tree-two">
          <span />
          <span />
        </div>

        <div className="cs-tree cs-tree-three">
          <span />
          <span />
        </div>

        {/* Road */}
        <div className="cs-road absolute inset-x-0 bottom-0">
          <span />
          <span />
          <span />
          <span />
        </div>

        {/* Moving school bus */}
        <div className="cs-bus">
          <span className="cs-bus-label">SCHOOL</span>

          <div className="cs-bus-windows">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="cs-bus-front-window" />

          <span className="cs-bus-bumper" />

          <span className="cs-wheel cs-wheel-one">
            <span />
          </span>

          <span className="cs-wheel cs-wheel-two">
            <span />
          </span>
        </div>

        {/* Sparkles */}
        <span className="cs-sparkle cs-sparkle-one">✦</span>
        <span className="cs-sparkle cs-sparkle-two">✧</span>

        </div>

        <header className="landing-navbar mx-4 mt-3 flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl px-4 py-2 text-white sm:mx-8 sm:px-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Class<span className="text-[#FFDF59]">Sphere</span>
          </Link>

          <nav aria-label="Main navigation" className="landing-nav order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:w-auto sm:flex-1 sm:justify-center">
            <a href="#home" className="landing-nav-link">Home</a>
            <Link to="/student/dashboard" className="landing-nav-link">Dashboard</Link>
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
            <a href="#contact" className="landing-nav-link">Contact Us</a>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:ml-0 sm:gap-2">
            <Link
              to="/login"
              className="rounded-xl border border-white/10 bg-[#45436A] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#57547D] sm:px-4"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-[#FFDF59] px-3 py-2 text-sm font-bold text-[#1F1D3D] transition hover:bg-[#ffe873] sm:px-4"
            >
              Register
            </Link>
          </div>
        </header>

        {/* Hero content */}
        <div className="landing-content mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col items-start justify-center px-5 py-5 text-left sm:px-8 sm:py-6">
        <p className="mb-5 text-xs font-extrabold tracking-[0.22em] text-[#3266B5] sm:text-sm">
          ✦ YOUR LEARNING SPACE ✦
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#1F1D3D] sm:text-5xl lg:text-6xl">
          Welcome to{" "}
          <span className="text-[#002152]">ClassSphere!</span>
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          Your all-in-one learning space where classes, study
          materials, assignments, and progress come together.
          Stay organized, learn at your own pace, and make every
          small step count.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-start gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-[rgb(0,5,78)] bg-[#1F1D3D] px-7 py-4 font-bold text-[#ffffff] transition hover:-translate-y-0.5 hover:border-[#ffe873] hover:bg-[#ffe873] hover:shadow-lg"
          >
            Start your journey
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="mt-7 text-sm font-semibold text-slate-500">
          ✦ Learn a little. Grow a lot. ✦
        </p>
        </div>
      </section>

      <section id="features" className="landing-section landing-features px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#002152]">MADE FOR EVERY LEARNING DAY</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Everything you need to keep learning moving</h2>
            <p className="mt-4 leading-7 text-slate-600">Spend less time searching and more time learning. ClassSphere brings your study essentials together in one clear space.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">📚</span>
              <h3 className="mt-4 text-lg font-bold">Classes & materials</h3>
              <p className="mt-2 leading-6 text-slate-600">Keep class resources and study materials organized and easy to revisit when it is time to learn.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">✅</span>
              <h3 className="mt-4 text-lg font-bold">Assignments & progress</h3>
              <p className="mt-2 leading-6 text-slate-600">See your learning tasks and progress in one place, so the next step always feels clear.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">🗓️</span>
              <h3 className="mt-4 text-lg font-bold">A calmer study routine</h3>
              <p className="mt-2 leading-6 text-slate-600">Bring your learning plans together and build steady habits one small step at a time.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section landing-faq px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#3266B5]">GOT QUESTIONS?</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          </div>

          <div className="mt-8 space-y-3">
            <details className="landing-faq-item">
              <summary>What is ClassSphere?</summary>
              <p>ClassSphere is a learning space designed to bring classes, study materials, assignments, and progress together.</p>
            </details>
            <details className="landing-faq-item">
              <summary>Who can use ClassSphere?</summary>
              <p>It is built for learners who want a simple place to organize their studies and keep track of their learning journey.</p>
            </details>
            <details className="landing-faq-item">
              <summary>How do I get started?</summary>
              <p>Use the Register button to create an account, or choose Dashboard to explore the student learning space.</p>
            </details>
            <details className="landing-faq-item">
              <summary>Where can I get help?</summary>
              <p>Start with the answers on this page. For course-specific questions, contact your teacher or course team.</p>
            </details>
          </div>
        </div>
      </section>

      {/* <section id="contact" className="landing-contact px-5 py-12 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-extrabold tracking-[0.2em] text-[#FFDF59]">WE’RE HERE TO HELP</p>
          <h2 className="mt-3 text-3xl font-extrabold">Let’s make learning feel simpler.</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">Have a question about your classes or study materials? Check the FAQs above or reach out to your teacher or course team for support.</p>
          <a href="#faq" className="mt-6 inline-flex rounded-xl bg-[#FFDF59] px-5 py-3 font-bold text-[#1F1D3D] transition hover:bg-[#ffe873]">Visit FAQs</a>
        </div>
      </section> */}

      <footer className="landing-footer px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-white"
          >
            Class<span className="text-[#FFDF59]">Sphere</span>
            <span className="mt-3 block max-w-xs text-sm font-normal leading-6 text-white/65">Your all-in-one space to stay organized, learn at your own pace, and make every small step count.</span>
          </Link>

          <div>
            <h3 className="font-bold">Explore</h3>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-white/70">
              <a href="#home" className="hover:text-white">Home</a>
              <Link to="/student/dashboard" className="hover:text-white">Dashboard</Link>
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#faq" className="hover:text-white">FAQ</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Your account</h3>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-white/70">
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Need a hand?</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">For help with a class or course, contact your teacher or course team.</p>
            <a href="#contact" className="mt-2 inline-block text-sm font-semibold text-[#FFDF59] hover:underline">Contact us</a>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/15 pt-5 text-center text-xs text-white/55 sm:flex-row sm:text-left">
          <p>Learn a little. Grow a lot.</p>
          <p>© {new Date().getFullYear()} ClassSphere. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
