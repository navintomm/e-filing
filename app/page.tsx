import Link from "next/link";
import { Scale, FileText, Users, Shield, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto animate-fadeInUp">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200 mb-8 shadow-lg">
            <Scale className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-700">Professional Legal Portal</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="section-header block">
              Vakalath Drafting
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
              & e-Filing Portal
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
            Professional legal document drafting made simple, secure, and efficient for modern advocates
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="btn-legal-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <Users className="w-5 h-5" />
              Advocate Login
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/drafting"
              className="btn-legal-outline inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <FileText className="w-5 h-5" />
              Browse Documents
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {/* Feature 1 */}
            <div className="premium-card p-8 text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-legal">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Drafting</h3>
              <p className="text-slate-600 mb-4">
                Create professional Vakalathnama and legal documents with intelligent templates and auto-fill features
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Step-by-step wizard
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  I/We auto-detection
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  PDF & DOCX export
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="premium-card p-8 text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-legal">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Secure & Compliant</h3>
              <p className="text-slate-600 mb-4">
                Bank-level encryption and compliance with legal standards for document privacy and security
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Encrypted storage
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Legal compliance
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Audit trails
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="premium-card p-8 text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-legal">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Advocate-Friendly</h3>
              <p className="text-slate-600 mb-4">
                Designed specifically for advocates with intuitive interface and professional document output
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Simple workflow
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Draft management
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Quick access
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 glass-container">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm text-slate-600 font-medium">Secure</div>
              </div>
              <div className="text-center border-x border-slate-200">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  Fast
                </div>
                <div className="text-sm text-slate-600 font-medium">Generation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-sm text-slate-600 font-medium">Available</div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-4">Ready to streamline your legal workflow?</p>
            <Link href="/login" className="btn-legal-secondary inline-flex items-center gap-2">
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="legal-badge animate-pulse">
          ✨ Professional Grade
        </div>
      </div>
    </main>
  );
}
