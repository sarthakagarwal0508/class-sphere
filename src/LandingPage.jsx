
import { Link } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ClipboardList,
  Compass,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page w-full bg-white text-[#1F1D3D]">
      <section id="home" className="landing-hero">
        
        <div className="cs-scene" aria-hidden="true">
       
        <div className="cs-sun absolute rounded-full" />

      
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

        <div className="cs-hill cs-hill-one" />
        <div className="cs-hill cs-hill-two" />

       
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

        <div className="cs-road absolute inset-x-0 bottom-0">
          <span />
          <span />
          <span />
          <span />
        </div>

       
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

        <span className="cs-sparkle cs-sparkle-one">✦</span>
        <span className="cs-sparkle cs-sparkle-two">✧</span>

        </div>

        <header className="landing-navbar mx-4 mt-3 flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl px-4 py-2 text-white sm:mx-8 sm:px-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Class<span className="text-[#FFDF59]">Sphere</span>
          </Link>

          <nav aria-label="Main navigation" className="landing-nav order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:w-auto sm:flex-1 sm:justify-center">
            <a href="#home" className="landing-nav-link">Home</a>
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#study-toolkit" className="landing-nav-link">Study toolkit</a>
            <a href="#why-classsphere" className="landing-nav-link">Why ClassSphere</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
            <a href="#contact" className="landing-nav-link">Contact Us</a>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:ml-0 sm:gap-2">
            <ThemeToggle className="landing-theme-toggle" />
            <Link
              to="/login"
              className="landing-login rounded-xl border border-white/10 bg-[#45436A] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#57547D] sm:px-4"
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
              <span className="landing-feature-icon" aria-hidden="true"><BookOpen size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Classes & materials</h3>
              <p className="mt-2 leading-6 text-slate-600">Keep class resources and study materials organized and easy to revisit when it is time to learn.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><ClipboardList size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Assignments & deadlines</h3>
              <p className="mt-2 leading-6 text-slate-600">Keep track of classroom assignments and due dates so you can plan your work with confidence.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><Brain size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Flashcards for revision</h3>
              <p className="mt-2 leading-6 text-slate-600">Review important ideas with quick flashcard sessions that help reinforce what you have learned.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><Sparkles size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Notes summaries</h3>
              <p className="mt-2 leading-6 text-slate-600">Turn shared study notes into concise key points and revision material to make review easier.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><TrendingUp size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Progress reports</h3>
              <p className="mt-2 leading-6 text-slate-600">See your learning activity, assignment status, and course progress together in one place.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><MessageCircle size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Doubt forum</h3>
              <p className="mt-2 leading-6 text-slate-600">Ask questions, share explanations, and get help from classmates and teachers.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><Target size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Quizzes & practice</h3>
              <p className="mt-2 leading-6 text-slate-600">Practice course topics with quizzes and check your understanding as you learn.</p>
            </article>
            <article className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true"><Bell size={21} /></span>
              <h3 className="mt-4 text-lg font-bold">Class announcements</h3>
              <p className="mt-2 leading-6 text-slate-600">Stay up to date with classroom news, reminders, and updates from your teachers.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="study-toolkit" className="landing-section landing-toolkit px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="landing-toolkit-heading mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#3266B5]">YOUR STUDY TOOLKIT</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Turn class resources into real understanding</h2>
            <p className="mt-4 leading-7 text-slate-600">A useful study session is more than reading notes. ClassSphere gives you tools to review, make sense of a topic, and test what you remember.</p>
          </div>

          <div className="landing-toolkit-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="landing-toolkit-card">
              <span className="landing-toolkit-icon" aria-hidden="true"><BookOpen size={21} /></span>
              <p className="landing-toolkit-step">START WITH YOUR CLASS</p>
              <h3 className="mt-3 text-lg font-bold">Find the right material</h3>
              <p className="mt-2 leading-6 text-slate-600">Open class resources and revisit the notes or files shared for the topic you are studying.</p>
            </article>
            <article className="landing-toolkit-card">
              <span className="landing-toolkit-icon" aria-hidden="true"><Sparkles size={21} /></span>
              <p className="landing-toolkit-step">MAKE SENSE OF IT</p>
              <h3 className="mt-3 text-lg font-bold">Review key ideas</h3>
              <p className="mt-2 leading-6 text-slate-600">Use Notes AI to turn study notes into concise key points you can revisit while learning.</p>
            </article>
            <article className="landing-toolkit-card">
              <span className="landing-toolkit-icon" aria-hidden="true"><Brain size={21} /></span>
              <p className="landing-toolkit-step">PRACTICE RECALL</p>
              <h3 className="mt-3 text-lg font-bold">Strengthen your memory</h3>
              <p className="mt-2 leading-6 text-slate-600">Use flashcards to bring important terms and concepts back to mind in short study sessions.</p>
            </article>
            <article className="landing-toolkit-card">
              <span className="landing-toolkit-icon" aria-hidden="true"><Target size={21} /></span>
              <p className="landing-toolkit-step">CHECK YOURSELF</p>
              <h3 className="mt-3 text-lg font-bold">See what you understand</h3>
              <p className="mt-2 leading-6 text-slate-600">Try a quiz to check your understanding and identify topics to review again.</p>
            </article>
          </div>

          <div className="landing-toolkit-note mx-auto mt-7 flex max-w-4xl items-start gap-3 rounded-xl p-4 sm:items-center">
            <RefreshCw size={19} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true" />
            <p className="text-sm leading-6"><strong>Keep the learning loop going.</strong> Review what you know, practice what you are learning, and return to challenging ideas at your own pace.</p>
          </div>
        </div>
      </section>

      <section id="why-classsphere" className="landing-section landing-why px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#3266B5]">WHY CLASSSPHERE?</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Less time chasing classwork. More time learning.</h2>
            <p className="mt-5 leading-7 text-slate-600">
              Schoolwork can end up spread across messages, files, and separate tools. ClassSphere gives your classroom one shared place for the everyday work of learning, from the first class resource to the latest progress check.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              It is not just a place to store materials. Students can use those resources to practice and ask questions, while teachers can share work and follow how the class is progressing.
            </p>
            <Link to="/register" className="landing-text-link mt-6 inline-flex items-center gap-2 font-bold">
              See what your learning space can do <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="landing-why-points grid gap-4 sm:grid-cols-2">
            <article className="landing-why-card">
              <span className="landing-why-icon" aria-hidden="true"><Compass size={20} /></span>
              <h3 className="mt-4 text-lg font-bold">Know where things belong</h3>
              <p className="mt-2 leading-6 text-slate-600">Classes, materials, assignments, and announcements have a shared home, so important information is easier to find again.</p>
            </article>
            <article className="landing-why-card">
              <span className="landing-why-icon" aria-hidden="true"><CalendarDays size={20} /></span>
              <h3 className="mt-4 text-lg font-bold">Make the next step clearer</h3>
              <p className="mt-2 leading-6 text-slate-600">See class tasks and due dates together and make a plan for what to study or complete next.</p>
            </article>
            <article className="landing-why-card">
              <span className="landing-why-icon" aria-hidden="true"><RefreshCw size={20} /></span>
              <h3 className="mt-4 text-lg font-bold">Turn review into practice</h3>
              <p className="mt-2 leading-6 text-slate-600">Revisit topics with notes, flashcards, and quizzes instead of stopping at simply collecting resources.</p>
            </article>
            <article className="landing-why-card">
              <span className="landing-why-icon" aria-hidden="true"><UsersRound size={20} /></span>
              <h3 className="mt-4 text-lg font-bold">Keep the classroom connected</h3>
              <p className="mt-2 leading-6 text-slate-600">Teachers can share updates and review student work; students can ask questions and follow their learning.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-journey px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#3266B5]">A CLEARER WAY TO LEARN</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From class time to confident progress</h2>
            <p className="mt-4 leading-7 text-slate-600">Keep the important parts of learning connected, so it is easier to know what to do next.</p>
          </div>

          <div className="landing-journey-grid mt-10 grid gap-5 md:grid-cols-3">
            <article className="landing-journey-card">
              <span className="landing-journey-number">01</span>
              <h3 className="mt-5 text-xl font-bold">Join your classroom</h3>
              <p className="mt-2 leading-7 text-slate-600">Find your classes and see the materials, announcements, and activities your teacher shares.</p>
            </article>
            <article className="landing-journey-card">
              <span className="landing-journey-number">02</span>
              <h3 className="mt-5 text-xl font-bold">Learn and practice</h3>
              <p className="mt-2 leading-7 text-slate-600">Review class resources, work through assignments, and use quizzes and flashcards to practice.</p>
            </article>
            <article className="landing-journey-card">
              <span className="landing-journey-number">03</span>
              <h3 className="mt-5 text-xl font-bold">See your next step</h3>
              <p className="mt-2 leading-7 text-slate-600">Check your progress, revisit topics, and ask questions when you need a little extra help.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="for-everyone" className="landing-section landing-audience px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#3266B5]">ONE SPACE, TWO PERSPECTIVES</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Made for the whole classroom</h2>
            <p className="mt-4 leading-7 text-slate-600">Students and teachers get tools that make their everyday learning and teaching easier to manage.</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="landing-audience-card landing-audience-student">
              <span className="landing-audience-label">FOR STUDENTS</span>
              <h3 className="mt-4 text-2xl font-extrabold">Make learning feel manageable.</h3>
              <p className="mt-3 leading-7 text-slate-600">Spend less time figuring out where things are and more time building understanding, one class at a time.</p>
              <ul className="landing-audience-list mt-6 space-y-3">
                <li><span aria-hidden="true"><Check size={14} /></span> Keep class materials and tasks together</li>
                <li><span aria-hidden="true"><Check size={14} /></span> Practice with quizzes and flashcards</li>
                <li><span aria-hidden="true"><Check size={14} /></span> Follow your progress and ask questions</li>
              </ul>
              <Link to="/register" className="landing-text-link mt-7 inline-flex items-center gap-2 font-bold">
                Get started as a student <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="landing-audience-card landing-audience-teacher">
              <span className="landing-audience-label">FOR TEACHERS</span>
              <h3 className="mt-4 text-2xl font-extrabold">Bring your classroom together.</h3>
              <p className="mt-3 leading-7 text-slate-600">Share resources, organize class activities, and keep an eye on how learners are doing from one teaching space.</p>
              <ul className="landing-audience-list mt-6 space-y-3">
                <li><span aria-hidden="true"><Check size={14} /></span> Share materials and announcements</li>
                <li><span aria-hidden="true"><Check size={14} /></span> Create assignments and quizzes</li>
                <li><span aria-hidden="true"><Check size={14} /></span> Review submissions and class progress</li>
              </ul>
              <Link to="/register" className="landing-text-link mt-7 inline-flex items-center gap-2 font-bold">
                Get started as a teacher <span aria-hidden="true">→</span>
              </Link>
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
              <p>Students can organize their studies and track progress, while teachers can manage classroom materials, activities, and student work.</p>
            </details>
            <details className="landing-faq-item">
              <summary>How do I get started?</summary>
              <p>Use the Register button to create an account, then log in to open your learning space.</p>
            </details>
            <details className="landing-faq-item">
              <summary>Where can I get help?</summary>
              <p>Start with the answers on this page. For course-specific questions, contact your teacher or course team.</p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-section landing-contact px-5 py-16 sm:px-8 lg:px-12">
        <div className="landing-contact-panel mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-3xl px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#ffe873]">YOUR NEXT CHAPTER STARTS HERE</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to make learning feel more connected?</h2>
            <p className="mt-4 leading-7 text-white/75">Create your ClassSphere account to bring classes, study resources, and progress into one learning space.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-[#FFDF59] px-6 py-3 font-bold text-[#1F1D3D] transition hover:-translate-y-0.5 hover:bg-[#ffe873]">
              Create your account <span aria-hidden="true">→</span>
            </Link>
            <Link to="/login" className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/"
            className="landing-footer-brand text-2xl font-extrabold tracking-tight"
          >
            Class<span className="text-[#FFDF59]">Sphere</span>
            <span className="landing-footer-muted mt-3 block max-w-xs text-sm font-normal leading-6">Your all-in-one space to stay organized, learn at your own pace, and make every small step count.</span>
          </Link>

          <div>
            <h3 className="font-bold">Explore</h3>
            <div className="landing-footer-links mt-3 flex flex-col items-start gap-2 text-sm">
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#study-toolkit">Study toolkit</a>
              <a href="#why-classsphere">Why ClassSphere</a>
              <a href="#how-it-works">How it works</a>
              <a href="#for-everyone">For students & teachers</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact us</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Your account</h3>
            <div className="landing-footer-links mt-3 flex flex-col items-start gap-2 text-sm">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Need a hand?</h3>
            <p className="landing-footer-muted mt-3 text-sm leading-6">For help with a class or course, contact your teacher or course team.</p>
            <a href="#contact" className="mt-2 inline-block text-sm font-semibold text-[#FFDF59] hover:underline">Contact us</a>
          </div>
        </div>

        <div className="landing-footer-copy mx-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-3 border-t pt-5 text-center text-xs sm:flex-row sm:text-left">
          <p>Learn a little. Grow a lot.</p>
          <p>© {new Date().getFullYear()} ClassSphere. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
