import React, { useState, useEffect } from "react";
import { Resend } from "resend";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Mail,
  MapPin,
  Home,
  Building2,
  GraduationCap,
  Container,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Ruler,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getCategories,
  getProjectsByCategory,
  getHeroSlides,
} from "./api/api.js";
import useProjects from "./hooks/useProjects";

const HLAWebsite = () => {
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    projectType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize Resend
  const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      };

      await resend.emails.send({
        from: "Hla Architecture <onboarding@resend.dev>",
        to: "lewison97@gmail.com",
        subject: `New Contact Form Submission from ${formData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message}</p>
        `,
      });

      setSuccess("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
      console.error("Error sending message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [categories, setCategories] = useState({});
  const [heroSlides, setHeroSlides] = useState([]);
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});

  useEffect(() => {
    const fetchCategoriesAndSlides = async () => {
      const [categoriesData, heroSlidesData] = await Promise.all([
        getCategories(),
        getHeroSlides(),
      ]);
      setCategories(categoriesData);
      setHeroSlides(heroSlidesData);
    };

    fetchCategoriesAndSlides();
  }, []);

  // Track initial load state
  useEffect(() => {
    if (!projectsLoading) {
      setIsInitialLoad(false);
      setHeroSlides(projects.filter((project) => project.is_featured));
    }
  }, [projectsLoading]);

  // Auto-slide for hero section
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  // Handle ESC key for modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (selectedCategory) {
          setSelectedCategory(null);
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedProject, selectedCategory]);

  // Handle visibility states for direct modal opens (not transitions)
  useEffect(() => {
    if (selectedCategory && !projectModalVisible) {
      setCategoryModalVisible(true);
    }
  }, [selectedCategory, projectModalVisible]);

  useEffect(() => {
    if (selectedProject && !categoryModalVisible) {
      setProjectModalVisible(true);
    }
  }, [selectedProject, categoryModalVisible]);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (selectedProject || selectedCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject, selectedCategory]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProject = () => {
    setIsTransitioning(true);
    // Start exit animation for project modal
    setProjectModalVisible(false);

    // After animation, close project and show category modal if it was open
    setTimeout(() => {
      setSelectedProject(null);
      setCurrentImageIndex(0);

      // If there was a category open, show it again
      if (selectedCategory) {
        setCategoryModalVisible(true);
      }
      setIsTransitioning(false);
    }, 300); // Match animation duration
  };

  const openCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryModalVisible(true);
  };

  const closeCategory = () => {
    setCategoryModalVisible(false);
    setTimeout(() => {
      setSelectedCategory(null);
    }, 300); // Match animation duration
  };

  const openProjectFromCategory = (project) => {
    setIsTransitioning(true);
    // Start exit animation for category modal
    setCategoryModalVisible(false);

    // After animation, open project modal
    setTimeout(() => {
      setSelectedProject(project);
      setCurrentImageIndex(0);
      setProjectModalVisible(true);
      setIsTransitioning(false);
    }, 300); // Match animation duration
  };

  const getProjectsByCategory = (category) => {
    return projects.filter((project) => project.category === category);
  };

  const iconMap = {
    Home,
    Building2,
    GraduationCap,
    Container,
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  const Logo = () => (
    <div className="text-2xl font-bold">
      <span className="text-black">HLA</span>
      <span className="text-[#2D5A3D]">rchitects</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-gray-900 hover:text-[#2D5A3D] transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-900 hover:text-[#2D5A3D] transition-colors"
              >
                About
              </a>
              <a
                href="#projects"
                className="text-gray-900 hover:text-[#2D5A3D] transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-900 hover:text-[#2D5A3D] transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-900 hover:text-[#2D5A3D]"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a
                  href="#home"
                  className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]"
                >
                  About
                </a>
                <a
                  href="#projects"
                  className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {!imageLoadingStatus[slide.image] && (
                <div className="absolute inset-0 bg-gray-900 animate-pulse" />
              )}
              <img
                src={slide.image}
                alt={slide.title}
                onLoad={() =>
                  setImageLoadingStatus((prev) => ({
                    ...prev,
                    [slide.image]: true,
                  }))
                }
                className={`w-full h-full object-cover transition-opacity duration-1000 ${
                  imageLoadingStatus[slide.image] ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              Beautiful, Vibrant &<br />
              <span className="text-[#4A7C59]">Sustainable</span> Buildings
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Creating meaningful architecture that values users and society
            </p>
            <div className="flex justify-center space-x-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible.about
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">
                Over <span className="text-[#2D5A3D]">20 Years</span>
                <br />
                of Excellence
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                HLArchitects is a Johannesburg-based architectural and design
                firm involved in a wide range of projects including residential,
                commercial, leisure and educational buildings.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We approach each project with ambition and passion, creating
                functional, cost-effective and beautiful buildings that have
                meaning and value to users and society.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-0.5 bg-[#2D5A3D]"></div>
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                  Three Generations of Partners
                </span>
              </div>
            </div>

            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible.about
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <img
                src="https://kgdfprpbmoqappauumjb.supabase.co/storage/v1/object/public/project-images/prj118-Image%202.jpg"
                alt="Modern architecture"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Leadership */}
          <div className="mt-20">
            <h3 className="text-3xl font-light mb-12 text-center text-gray-900">
              Leadership
            </h3>
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gray-50 rounded-lg p-8">
                <h4 className="text-2xl font-medium mb-4 text-gray-900">
                  Martin Lewison
                </h4>
                <p className="text-[#2D5A3D] font-medium mb-4">
                  Principal & Registered Professional Architect
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Martin joined the company in 1991 and became partner in 2002.
                  With approximately 25 years of practice, he has contributed
                  his expertise and vision to the quality of design, creativity
                  and high level of service that forms the backbone of
                  HLArchitects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
              Featured <span className="text-[#2D5A3D]">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse portfolio spanning residential, commercial,
              educational and innovative container architecture projects.
            </p>
            {projectsLoading && isInitialLoad ? (
              <div className="w-full py-16 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A3D] mb-4"></div>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.is_featured)
                  .map((project, index) => (
                    <div
                      key={project.id || index}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      className="group"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                        <div className="relative overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                          <div className="absolute top-4 right-4">
                            <span className="bg-[#2D5A3D] text-white px-3 py-1 rounded-full text-sm">
                              {project.year}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-medium mb-2 text-gray-900 group-hover:text-[#2D5A3D] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {project.category}
                          </p>
                          <div
                            className="flex items-center text-[#2D5A3D] group-hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                            onClick={() =>
                              openProjectFromCategory
                                ? openProjectFromCategory(project)
                                : openProject(project)
                            }
                          >
                            <span className="text-sm font-medium">
                              View Project
                            </span>
                            <ArrowRight size={16} className="ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="bg-[#2D5A3D] text-white px-8 py-3 rounded-lg hover:bg-[#4A7C59] transition-colors duration-300 inline-block text-center"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
              Our <span className="text-[#2D5A3D]">Expertise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Residential",
                icon: Home,
                description:
                  "Custom homes and residential developments that enhance living experiences",
              },
              {
                title: "Commercial",
                icon: Building2,
                description:
                  "Office buildings and commercial spaces that drive business success",
              },
              {
                title: "Education",
                icon: GraduationCap,
                description:
                  "Learning environments that inspire and facilitate education",
              },
              {
                title: "Container Architecture",
                icon: Container,
                description:
                  "Innovative solutions using sustainable container construction",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
                onClick={() => openCategory(service.title)}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-50 rounded-lg group-hover:bg-[#2D5A3D] transition-colors duration-300">
                  <service.icon
                    size={32}
                    className="text-[#2D5A3D] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900 group-hover:text-[#2D5A3D] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-center text-[#2D5A3D] group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm font-medium">View Projects</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-8">
                Let's Create Something
                <br />
                <span className="text-[#4A7C59]">Beautiful</span> Together
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Ready to start your architectural journey? We offer a
                personalised service where a partner is involved in every
                project from inception to completion.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="text-[#4A7C59]" size={24} />
                  <span>hla@hla.co.za</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="text-[#4A7C59]" size={24} />
                  <span>Johannesburg, South Africa</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-500 text-sm bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 text-green-500 text-sm bg-green-900/20 p-3 rounded-lg">
                  {success}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-medium mb-6">Start Your Project</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4A7C59]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setFormData({ ...formData, email });
                      // Simple email validation
                      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        setError("Please enter a valid email address");
                      } else {
                        setError("");
                      }
                    }}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4A7C59]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4A7C59]"
                    required
                  >
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="education">Education</option>
                    <option value="container">Container Architecture</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4A7C59]"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.email ||
                      !formData.message ||
                      !formData.projectType
                    }
                    className="w-full px-6 py-3 bg-[#4A7C59] text-white rounded-lg hover:bg-[#385a47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Submit contact form"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          aria-label="Loading..."
                        />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-500 text-sm">{success}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Logo />
              <p className="text-gray-400 mt-4 leading-relaxed">
                Creating beautiful, vibrant and sustainable buildings for over
                20 years.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#home"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#projects"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Services</h4>
              <div className="space-y-2">
                <span className="block text-gray-400">Residential</span>
                <span className="block text-gray-400">Commercial</span>
                <span className="block text-gray-400">Education</span>
                <span className="block text-gray-400">
                  Container Architecture
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HLArchitects. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Category Modal */}
      {selectedCategory && !selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeCategory}
          ></div>

          {/* Modal Content */}
          <div
            className={`relative bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl transition-all duration-300 ${
              categoryModalVisible
                ? "animate-in zoom-in-95 opacity-100 scale-100"
                : "animate-out zoom-out-95 opacity-0 scale-95"
            }`}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-8">
              <button
                onClick={closeCategory}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-[#2D5A3D] rounded-xl flex items-center justify-center shadow-lg">
                  {React.createElement(
                    iconMap[categories[selectedCategory].icon],
                    {
                      size: 28,
                      className: "text-white",
                    }
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {categories[selectedCategory].title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {getProjectsByCategory(selectedCategory).length} Projects
                    Completed
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4A7C59] mb-1">
                    {categories[selectedCategory].stats.completed}
                  </div>
                  <div className="text-sm text-gray-300">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4A7C59] mb-1">
                    {categories[selectedCategory].stats.years}
                  </div>
                  <div className="text-sm text-gray-300">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-white mb-1">
                    {categories[selectedCategory].stats.specialty}
                  </div>
                  <div className="text-sm text-gray-300">Specialty</div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto">
              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {categories[selectedCategory].description}
                </p>
              </div>

              {/* Projects Grid */}
              <div className="pr-2">
                {getProjectsByCategory(selectedCategory).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {getProjectsByCategory(selectedCategory).map(
                      (project, index) => (
                        <div
                          key={project.id}
                          className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                          onClick={() => openProjectFromCategory(project)}
                        >
                          <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-[#2D5A3D]/20 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative overflow-hidden">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute top-4 left-4">
                                <span className="bg-[#2D5A3D] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                  {project.year}
                                </span>
                              </div>
                              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <ArrowRight
                                    size={16}
                                    className="text-[#2D5A3D]"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-[#2D5A3D] transition-colors">
                                {project.title}
                              </h3>
                              <div className="flex items-center text-gray-500 mb-3">
                                <MapPin size={14} className="mr-1" />
                                <span className="text-sm">
                                  {project.location}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {React.createElement(
                        iconMap[categories[selectedCategory].icon],
                        {
                          size: 24,
                          className: "text-gray-400",
                        }
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No projects yet
                    </h3>
                    <p className="text-gray-500">
                      We're working on exciting new{" "}
                      {selectedCategory.toLowerCase()} projects.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
            onClick={closeProject}
          ></div>

          {/* Modal Content */}
          <div
            className={`relative w-full max-h-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 overflow-hidden transition-all duration-300 ${
              projectModalVisible
                ? "animate-in zoom-in-95 opacity-100 scale-100"
                : "animate-out zoom-out-95 opacity-0 scale-95"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeProject}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Back to Category Button (if came from category) */}
            {selectedCategory && (
              <button
                onClick={closeProject}
                className="absolute top-6 left-6 z-10 flex items-center space-x-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full px-4 py-2 text-white transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="text-sm">Back to {selectedCategory}</span>
              </button>
            )}

            {/* Image Gallery */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Main Image */}
              <div className="relative flex-1 bg-black rounded-lg overflow-hidden min-h-0">
                <img
                  src={selectedProject.images[currentImageIndex]}
                  alt={`${selectedProject.title} - Image ${
                    currentImageIndex + 1
                  }`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedProject.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {selectedProject.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {selectedProject.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-[#4A7C59]"
                          : "border-transparent hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Details Sidebar */}
            <div className="lg:w-96 bg-white rounded-lg p-6 overflow-y-auto max-h-full">
              <div className="space-y-6">
                {/* Project Header */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#2D5A3D] font-medium mb-2">
                    <span>{selectedProject.category}</span>
                    <span>•</span>
                    <span>{selectedProject.year}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#2D5A3D]" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedProject.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ruler size={20} className="text-[#2D5A3D]" />
                    <div>
                      <p className="text-sm text-gray-500">Total Area</p>
                      <p className="font-medium">{selectedProject.area}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#2D5A3D]" />
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="font-medium">{selectedProject.year}</p>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Interested in a similar project?
                  </h4>
                  <button className="w-full bg-[#2D5A3D] text-white py-3 rounded-lg hover:bg-[#4A7C59] transition-colors duration-300">
                    Get In Touch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HLAWebsite;
