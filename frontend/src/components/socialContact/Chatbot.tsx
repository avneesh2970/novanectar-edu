/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Icon Components
const MessageCircle = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const X = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Send = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const Bot = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
  </svg>
);

const User = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 I'm Nova, your AI assistant. I can help you with:\n\n• Services & Pricing\n• Portfolio\n• Booking Consultations\n• Answering Questions\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef: any = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const knowledgeBase = {
    services: {
      keywords: [
        "service",
        "what do you do",
        "offer",
        "provide",
        "help with",
        "can you",
      ],
      response:
        "Nova Nectar offers comprehensive IT solutions:\n\n🌐 **Website Development**\n• Custom responsive websites\n• E-commerce platforms\n• CMS integration (WordPress, Shopify)\n• Web applications\n\n📱 **App Development**\n• iOS & Android native apps\n• Cross-platform solutions\n• Progressive web apps\n• App maintenance & updates\n\n🔍 **SEO Services**\n• Keyword research & optimization\n• On-page & technical SEO\n• Link building strategies\n• Monthly performance reports\n\n🎨 **Graphic Design**\n• Brand identity & logos\n• Marketing materials\n• Social media graphics\n• Print design\n\n💻 **UI/UX Design**\n• User research & wireframing\n• Prototyping & testing\n• Responsive design\n• Design systems\n\n📢 **Digital Marketing**\n• Social media marketing\n• PPC campaigns (Google Ads)\n• Content marketing\n• Email marketing\n• Analytics & tracking\n\nWhich service interests you? I can provide more detailed information!",
    },
    websiteDev: {
      keywords: ["website", "web development", "site", "webpage", "web design"],
      response:
        "**Website Development Services:**\n\n✨ We create stunning, high-performance websites tailored to your business:\n\n**Types of Websites:**\n• Business/Corporate websites\n• E-commerce stores (WooCommerce, Shopify)\n• Portfolio & personal websites\n• Landing pages\n• Booking & reservation systems\n• Educational platforms\n• News & magazine sites\n\n**Technologies We Use:**\n• React, Next.js, Vue.js\n• WordPress, Shopify\n• Node.js, PHP, Python\n• Database: MySQL, MongoDB\n\n**Features Included:**\n✓ Responsive design (mobile-friendly)\n✓ Fast loading speed\n✓ SEO optimization\n✓ Security features (SSL)\n✓ Content management system\n✓ Contact forms & integrations\n✓ Analytics setup\n\n**Timeline:** 2-8 weeks depending on complexity\n**Starting from:** ₹50,000\n\nWould you like a custom quote for your project?",
    },
    appDev: {
      keywords: [
        "app development",
        "mobile app",
        "android",
        "ios",
        "application",
      ],
      response:
        "**Mobile App Development:**\n\n📱 We build powerful mobile applications:\n\n**Platforms:**\n• iOS (iPhone/iPad)\n• Android\n• Cross-platform (React Native, Flutter)\n\n**App Types We Develop:**\n• E-commerce & shopping apps\n• Social networking apps\n• On-demand service apps (Uber-like)\n• Food delivery apps\n• Fitness & health apps\n• Educational apps\n• Business management apps\n• Booking & reservation apps\n\n**Our Process:**\n1. Requirement analysis\n2. UI/UX design\n3. Development & coding\n4. Testing (iOS & Android)\n5. App Store submission\n6. Maintenance & updates\n\n**Features:**\n✓ Push notifications\n✓ Payment gateway integration\n✓ GPS & maps integration\n✓ Social media login\n✓ Real-time chat\n✓ Analytics dashboard\n✓ Admin panel\n\n**Timeline:** 6-12 weeks\n**Starting from:** ₹1,50,000\n\nTell me about your app idea!",
    },
    seo: {
      keywords: [
        "seo",
        "search engine",
        "ranking",
        "google",
        "traffic",
        "visibility",
      ],
      response:
        "**SEO Services - Rank Higher on Google:**\n\n🔍 We help your business get found online:\n\n**Our SEO Services Include:**\n\n📊 **SEO Audit & Strategy**\n• Complete website analysis\n• Competitor research\n• Keyword research (50+ targeted keywords)\n• Custom SEO roadmap\n\n🔧 **On-Page SEO**\n• Meta tags optimization\n• Content optimization\n• Header tags & structure\n• Image optimization\n• Internal linking\n• Schema markup\n\n⚙️ **Technical SEO**\n• Site speed optimization\n• Mobile-friendliness\n• XML sitemap creation\n• Robots.txt optimization\n• Fix crawl errors\n• SSL implementation\n\n🔗 **Off-Page SEO**\n• Quality backlink building\n• Guest posting\n• Directory submissions\n• Social bookmarking\n• Brand mentions\n\n📈 **Monthly Reporting**\n• Ranking reports\n• Traffic analysis\n• Conversion tracking\n• Competitor monitoring\n\n**Results:** Typically see improvement in 3-6 months\n**Packages:** ₹25,000/month onwards\n\nWant to improve your Google rankings?",
    },
    design: {
      keywords: [
        "design",
        "graphic",
        "logo",
        "branding",
        "ui",
        "ux",
        "interface",
      ],
      response:
        "**Design Services:**\n\n🎨 **Graphic Design**\n• Logo design & brand identity\n• Business cards & stationery\n• Brochures & flyers\n• Social media graphics\n• Packaging design\n• Infographics\n• Presentations\n\n💻 **UI/UX Design**\n• User research & personas\n• Wireframing & prototyping\n• Interactive mockups\n• Usability testing\n• Design systems\n• Responsive layouts\n\n**Design Process:**\n1. Understanding your brand\n2. Research & mood boards\n3. Concept development\n4. Revisions (2-3 rounds included)\n5. Final delivery (all formats)\n\n**Deliverables:**\n✓ Source files (AI, PSD, Figma)\n✓ High-resolution exports\n✓ Brand guidelines\n✓ Multiple format variations\n\n**Timeline:** 1-3 weeks\n**Logo Design:** Starting from ₹15,000\n**UI/UX Design:** Starting from ₹30,000\n\nLet's create something amazing for your brand!",
    },
    digitalMarketing: {
      keywords: [
        "marketing",
        "digital marketing",
        "social media",
        "ads",
        "facebook",
        "instagram",
        "promotion",
      ],
      response:
        "**Digital Marketing Services:**\n\n📢 Grow your business online with our marketing expertise:\n\n**Social Media Marketing**\n• Content creation & posting\n• Facebook, Instagram, LinkedIn, Twitter\n• Community management\n• Influencer collaborations\n• Social media strategy\n\n**Paid Advertising (PPC)**\n• Google Ads campaigns\n• Facebook & Instagram ads\n• LinkedIn advertising\n• Remarketing campaigns\n• A/B testing & optimization\n\n**Content Marketing**\n• Blog writing & SEO content\n• Video marketing\n• Email newsletters\n• E-books & whitepapers\n\n**Email Marketing**\n• Campaign design & execution\n• List building & segmentation\n• Automated email sequences\n• Performance tracking\n\n**Analytics & Reporting**\n• Google Analytics setup\n• Conversion tracking\n• ROI measurement\n• Monthly performance reports\n\n**Packages:**\n• Basic: ₹30,000/month (2 platforms)\n• Professional: ₹50,000/month (all platforms)\n• Enterprise: Custom pricing\n\n**Results:** Increased engagement, leads & sales\n\nReady to grow your online presence?",
    },
    pricing: {
      keywords: [
        "price",
        "cost",
        "how much",
        "budget",
        "charge",
        "fee",
        "quote",
        "rate",
      ],
      response:
        "**Pricing Information:**\n\n💰 Our pricing depends on project scope and requirements:\n\n**Website Development:**\n• Simple website: ₹50,000 - ₹1,00,000\n• Business website: ₹1,00,000 - ₹2,50,000\n• E-commerce: ₹2,00,000 - ₹5,00,000+\n• Custom web app: ₹3,00,000+\n\n**Mobile Apps:**\n• Simple app: ₹1,50,000 - ₹3,00,000\n• Medium complexity: ₹3,00,000 - ₹6,00,000\n• Complex app: ₹6,00,000+\n\n**SEO Services:**\n• Monthly packages: ₹25,000 - ₹75,000/month\n• One-time audit: ₹15,000\n\n**Design Services:**\n• Logo design: ₹15,000 - ₹50,000\n• Branding package: ₹75,000+\n• UI/UX design: ₹30,000 - ₹1,50,000\n\n**Digital Marketing:**\n• Monthly retainer: ₹30,000 - ₹1,00,000/month\n• Ad spend: Separate (managed by us)\n\n**What's Included:**\n✓ Free consultation\n✓ Project planning\n✓ Regular updates\n✓ Quality testing\n✓ Post-launch support\n✓ Training (if needed)\n\n**Payment Terms:** 50% advance, 50% on completion\n\nWant a detailed quote for your specific project? Share your requirements!",
    },
    portfolio: {
      keywords: [
        "portfolio",
        "project",
        "work",
        "example",
        "previous",
        "completed",
        "case study",
      ],
      response:
        '**Our Portfolio - 200+ Successful Projects:**\n\n🎯 **Featured Projects:**\n\n🏢 **Iconic 11** (2024)\n• Corporate website with CMS\n• Tech: React, Node.js\n• Result: 300% increase in inquiries\n\n🍽️ **The Tawa Restaurant** (2024)\n• Restaurant website with online ordering\n• Tech: WordPress, WooCommerce\n• Result: 50+ daily online orders\n\n🛒 **CaninKart** (2023)\n• E-commerce platform for pet products\n• Tech: Shopify, React\n• Result: ₹10L+ monthly revenue\n\n💼 **KKD Corporate** (2024)\n• Business website with portfolio\n• Tech: Next.js, Tailwind CSS\n• Result: Professional online presence\n\n💪 **FitLife Gym App** (2023)\n• Fitness tracking mobile app\n• Tech: React Native, Firebase\n• Result: 5,000+ active users\n\n📚 **EduTech Platform** (2024)\n• Online learning management system\n• Tech: MERN Stack\n• Result: 10,000+ students enrolled\n\n🏥 **MediCare** (2023)\n• Healthcare appointment system\n• Tech: Flutter, Django\n• Result: 500+ appointments/month\n\n✈️ **TravelEase** (2024)\n• Travel booking platform\n• Tech: Vue.js, Laravel\n• Result: Seamless booking experience\n\n🍕 **FoodHub** (2023)\n• Food delivery app\n• Tech: React Native, MongoDB\n• Result: Multi-restaurant platform\n\n🏠 **PropertyPro** (2024)\n• Real estate listing website\n• Tech: Angular, .NET\n• Result: 1,000+ property listings\n\n**Industries We\'ve Served:**\n• Healthcare & Medical\n• E-commerce & Retail\n• Education & E-learning\n• Food & Restaurants\n• Real Estate\n• Fitness & Wellness\n• Travel & Tourism\n• Finance & Banking\n\n**Client Testimonials:**\n⭐⭐⭐⭐⭐ "Excellent service! Professional team."\n⭐⭐⭐⭐⭐ "Delivered on time with great quality."\n⭐⭐⭐⭐⭐ "Best IT company in the region!"\n\nWant to see detailed case studies? I can share specific examples!',
    },
    timeline: {
      keywords: [
        "time",
        "duration",
        "how long",
        "delivery",
        "deadline",
        "timeline",
      ],
      response:
        "**Project Timelines:**\n\n⏱️ Typical delivery timeframes:\n\n**Website Development:**\n• Landing page: 1-2 weeks\n• Simple website (5-10 pages): 2-4 weeks\n• Business website: 4-6 weeks\n• E-commerce store: 6-10 weeks\n• Custom web application: 8-16 weeks\n\n**Mobile App Development:**\n• Simple app: 6-8 weeks\n• Medium complexity: 10-16 weeks\n• Complex app: 16-24 weeks\n\n**SEO Services:**\n• Initial setup: 1-2 weeks\n• See results: 3-6 months (ongoing)\n\n**Design Projects:**\n• Logo design: 1 week\n• Branding package: 2-3 weeks\n• UI/UX design: 2-4 weeks\n\n**Digital Marketing:**\n• Campaign setup: 1 week\n• See results: Ongoing (monthly basis)\n\n**Our Process:**\n1️⃣ Consultation (1-2 days)\n2️⃣ Planning & proposal (2-3 days)\n3️⃣ Design phase (varies)\n4️⃣ Development (varies)\n5️⃣ Testing & QA (1-2 weeks)\n6️⃣ Launch & handover (1 week)\n\n**Rush Projects:**\n• Available with 30% premium\n• Can reduce timeline by 30-40%\n\n**We prioritize:**\n✓ Quality over speed\n✓ Regular updates\n✓ On-time delivery\n✓ No compromise on testing\n\nNeed urgent delivery? Let me know your deadline!",
    },
    process: {
      keywords: [
        "process",
        "how do you work",
        "steps",
        "methodology",
        "workflow",
      ],
      response:
        "**Our 6-Step Process:**\n\n**1️⃣ Strategy & Planning**\n• Discovery call to understand your needs\n• Market & competitor research\n• Define project scope & goals\n• Create detailed roadmap\n• Timeline & milestone planning\n• Budget finalization\n\n**2️⃣ Wireframing & Design**\n• Create wireframes & mockups\n• Design user interface (UI)\n• Plan user experience (UX)\n• Get your feedback & approval\n• Revisions (2-3 rounds included)\n• Finalize design assets\n\n**3️⃣ Development**\n• Set up development environment\n• Write clean, scalable code\n• Implement features & functionality\n• Regular progress updates (weekly)\n• Follow best coding practices\n• Version control (Git)\n\n**4️⃣ Quality Assurance**\n• Comprehensive testing (manual & automated)\n• Cross-browser compatibility\n• Mobile responsiveness check\n• Performance optimization\n• Security testing\n• Bug fixing\n• User acceptance testing\n\n**5️⃣ Operation & Deployment**\n• Setup hosting & domain\n• Configure servers & databases\n• Deploy to production\n• SSL certificate installation\n• Final testing on live server\n• Backup setup\n\n**6️⃣ Launch & Support**\n• Official project launch\n• Training sessions (if needed)\n• Documentation handover\n• 30-day free support\n• Performance monitoring\n• Regular updates available\n\n**Throughout the project:**\n✓ Transparent communication\n✓ Regular status updates\n✓ Your feedback incorporated\n✓ Agile methodology\n✓ Quality-focused approach\n\nReady to start your project?",
    },
    contact: {
      keywords: [
        "contact",
        "reach",
        "email",
        "phone",
        "call",
        "message",
        "connect",
        "touch",
      ],
      response:
        "**Get in Touch with Us:**\n\n📞 **Contact Information:**\n\n🌐 **Website:** www.novanectar.co.in\n\n📧 **Email:** info@novanectar.co.in\n\n📱 **WhatsApp:** +91 98765 43210\n(Click to chat instantly)\n\n☎️ **Phone:** +91 98765 43210\n\n📍 **Office:** Ghaziabad, Uttar Pradesh, India\n\n⏰ **Business Hours:**\n• Monday - Friday: 9:00 AM - 6:00 PM\n• Saturday: 10:00 AM - 4:00 PM\n• Sunday: Closed\n\n**Prefer a Meeting?**\n• Schedule a free 30-minute consultation\n• Video call or in-person available\n• Discuss your project in detail\n\n**Quick Response Time:**\n• Email: Within 2-4 hours\n• WhatsApp: Within 30 minutes\n• Phone: Instant during business hours\n\n**Social Media:**\n• LinkedIn: /novanectar\n• Instagram: @novanectar\n• Facebook: /novanectar\n\n**What happens next?**\n1. You contact us\n2. We schedule a call\n3. Discuss your requirements\n4. Get a detailed proposal\n5. Start your project!\n\nHow would you like to connect? 😊",
    },
    team: {
      keywords: ["team", "who are you", "company", "about", "experience"],
      response:
        "**About Nova Nectar:**\n\n🚀 We're a passionate team of digital experts!\n\n**Our Expertise:**\n• 5+ years in the industry\n• 200+ successful projects delivered\n• 150+ satisfied clients\n• 100% project completion rate\n\n**Our Team:**\n👨‍💻 10+ Full-stack developers\n🎨 5+ UI/UX designers\n📱 4+ Mobile app developers\n📊 3+ Digital marketing experts\n🔍 2+ SEO specialists\n\n**Why Choose Us?**\n✓ Experienced professionals\n✓ Latest technologies\n✓ Quality-focused approach\n✓ On-time delivery\n✓ Transparent pricing\n✓ Post-launch support\n✓ 24/7 availability\n✓ 98% client satisfaction\n\n**Our Values:**\n💡 Innovation\n🎯 Excellence\n🤝 Integrity\n⚡ Efficiency\n\n**Awards & Recognition:**\n🏆 Best IT Company 2023\n🏆 Top Rated on Google (4.9★)\n🏆 Excellence in Web Development\n\nWant to work with us? Let's discuss your project!",
    },
  };

  const findResponse = (input: any) => {
    const lower = input.toLowerCase();

    // Check each knowledge base entry
    for (const [, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some((keyword) => lower.includes(keyword))) {
        return data.response;
      }
    }

    // Greetings
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey") ||
      lower.includes("namaste")
    ) {
      return "Hello! 👋 Welcome to Nova Nectar Services!\n\nI'm your AI assistant, here to help you with all your IT needs. I can provide detailed information about:\n\n• Our services (Web, App, SEO, Design, Marketing)\n• Pricing & packages\n• Portfolio & case studies\n• Project timelines\n• Our process & team\n• Contact information\n\nWhat would you like to know?";
    }

    // Thank you
    if (lower.includes("thank")) {
      return "You're very welcome! 😊\n\nI'm glad I could help. Feel free to ask if you have any other questions about our services.\n\nWould you like to:\n• Get a project quote?\n• Schedule a consultation?\n• See more of our work?\n\nI'm here to help! 🚀";
    }

    // Goodbye
    if (lower.includes("bye") || lower.includes("goodbye")) {
      return "Thank you for chatting with us! 👋\n\nBefore you go:\n📧 Email: info@novanectar.co.in\n📱 WhatsApp: +91 98765 43210\n🌐 Website: www.novanectar.co.in\n\nFeel free to reach out anytime. Have a great day! 😊";
    }

    // Off-topic or unrelated questions
    return "I appreciate your question! However, I specialize in helping with Nova Nectar's IT services.\n\n**For questions about our services, I can help with:**\n• Website & App Development\n• SEO & Digital Marketing\n• Design Services\n• Pricing & Timeline\n• Portfolio & Past Projects\n\n**For other inquiries, please contact us:**\n📧 Email: info@novanectar.co.in\n📱 WhatsApp: +91 98765 43210\n☎️ Phone: +91 98765 43210\n\nOur team will be happy to assist you personally! 😊\n\nIs there anything about our IT services I can help you with?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: input,
        timestamp: new Date(),
      },
    ]);

    const userInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: findResponse(userInput),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <motion.div
        className="fixed bottom-36 right-4 z-50 rounded-full"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 10px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center"
          >
            <MessageCircle size={24} />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs">
              Chat with us!
            </span>
          </button>
        )}

        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-96 h-[450px] flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2">
                  <Bot size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nova AI</h3>
                  <p className="text-xs opacity-90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex ${
                      msg.type === "user" ? "flex-row-reverse" : "flex-row"
                    } gap-2 max-w-[80%]`}
                  >
                    <div
                      className={`rounded-full p-2 flex-shrink-0 ${
                        msg.type === "user" ? "bg-blue-500" : "bg-purple-600"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`rounded-2xl p-3 ${
                          msg.type === "user"
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">
                          {msg.text}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="rounded-full p-2 bg-purple-600">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none p-3 bg-white shadow-sm">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`rounded-full p-2 transition-all ${
                    input.trim()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Powered by Nova Nectar AI
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Chatbot;
