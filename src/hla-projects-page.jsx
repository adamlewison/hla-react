import React, { useState, useEffect } from "react";
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
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Eye,
} from "lucide-react";

const HLAProjectsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Categories with enhanced data
  const categories = {
    All: {
      title: "All Projects",
      description: "Explore our complete portfolio of architectural excellence",
      icon: Grid3X3,
      count: 0, // Will be calculated
    },
    Residential: {
      title: "Residential Projects",
      description: "Custom homes and residential developments that enhance living experiences",
      icon: Home,
      count: 0,
    },
    Commercial: {
      title: "Commercial Projects", 
      description: "Office buildings and commercial spaces that drive business success",
      icon: Building2,
      count: 0,
    },
    Education: {
      title: "Educational Projects",
      description: "Learning environments that inspire and facilitate education",
      icon: GraduationCap,
      count: 0,
    },
    "Container Architecture": {
      title: "Container Architecture",
      description: "Innovative solutions using sustainable container construction",
      icon: Container,
      count: 0,
    },
  };

  // Expanded project data
  const projects = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Sustainable Family Home",
      category: "Residential",
      year: "2024",
      location: "Johannesburg, South Africa",
      area: "350 sqm",
      budget: "R 2.5M - R 3.5M",
      status: "Completed",
      description: "A modern sustainable family home featuring natural materials, energy-efficient systems, and seamless indoor-outdoor living spaces. This project showcases our commitment to environmental responsibility while maintaining luxury and comfort.",
      features: ["Solar panels", "Rainwater harvesting", "Natural ventilation", "Green roof"],
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753051-6057ee74c12d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Corporate Headquarters",
      category: "Commercial",
      year: "2023",
      location: "Sandton, Johannesburg",
      area: "2,500 sqm",
      budget: "R 15M - R 20M",
      status: "Completed",
      description: "A striking corporate headquarters designed to inspire innovation and collaboration. Features include flexible workspaces, green terraces, and state-of-the-art technology infrastructure.",
      features: ["Smart building systems", "Green terraces", "Flexible workspaces", "Conference facilities"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Modern Learning Center",
      category: "Education",
      year: "2024",
      location: "Cape Town, South Africa",
      area: "1,800 sqm",
      budget: "R 8M - R 12M",
      status: "Completed",
      description: "An innovative educational facility designed to foster creative learning and community engagement. Features flexible classrooms, collaborative spaces, and sustainable design elements.",
      features: ["Flexible classrooms", "Library spaces", "Outdoor learning areas", "Sustainable materials"],
      images: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Innovative Container Complex",
      category: "Container Architecture",
      year: "2023",
      location: "Pretoria, South Africa",
      area: "450 sqm",
      budget: "R 1.5M - R 2.5M",
      status: "Completed",
      description: "A groundbreaking container architecture project that transforms shipping containers into modern, functional spaces. This project demonstrates sustainable construction methods and adaptive reuse principles.",
      features: ["Modular design", "Sustainable construction", "Quick assembly", "Cost-effective"],
      images: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Urban Residential Tower",
      category: "Residential",
      year: "2024",
      location: "Johannesburg CBD",
      area: "8,500 sqm",
      budget: "R 50M+",
      status: "Completed",
      description: "A luxury residential tower that redefines urban living with panoramic views, premium amenities, and sustainable design features integrated throughout the building.",
      features: ["Panoramic views", "Premium amenities", "Sustainable systems", "Security features"],
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Retail Development",
      category: "Commercial",
      year: "2023",
      location: "Durban, South Africa",
      area: "3,200 sqm",
      budget: "R 12M - R 18M",
      status: "Completed",
      description: "A contemporary retail development that creates an engaging shopping experience through thoughtful design, natural lighting, and seamless flow between indoor and outdoor spaces.",
      features: ["Natural lighting", "Indoor-outdoor flow", "Retail optimization", "Parking solutions"],
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555529902-7c681d4a5154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Eco-Friendly Residence",
      category: "Residential",
      year: "2022",
      location: "Stellenbosch, South Africa",
      area: "280 sqm",
      budget: "R 2M - R 3M",
      status: "Completed",
      description: "An environmentally conscious home design that maximizes natural light, incorporates renewable energy systems, and uses locally sourced materials.",
      features: ["LEED certified", "Solar energy", "Local materials", "Water conservation"],
      images: [
        "https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752734-b1db11bed0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "University Science Building",
      category: "Education",
      year: "2022",
      location: "Wits University, Johannesburg",
      area: "3,500 sqm",
      budget: "R 25M - R 35M",
      status: "Completed",
      description: "A state-of-the-art science facility designed to support advanced research and collaborative learning with specialized laboratories and lecture halls.",
      features: ["Research labs", "Lecture theatres", "Collaborative spaces", "Specialized equipment"],
      images: [
        "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  // Calculate category counts
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {});

  // Update categories with counts
  Object.keys(categories).forEach(key => {
    if (key === "All") {
      categories[key].count = projects.length;
    } else {
      categories[key].count = categoryCounts[key] || 0;
    }
  });

  // Get available years
  const availableYears = ["All", ...new Set(projects.map(p => p.year))].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return b.localeCompare(a);
  });

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const matchesYear = selectedYear === "All" || project.year === selectedYear;
      return matchesSearch && matchesCategory && matchesYear;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.year.localeCompare(a.year);
        case "oldest":
          return a.year.localeCompare(b.year);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "size":
          return parseFloat(b.area) - parseFloat(a.area);
        default:
          return 0;
      }
    });

  // Handle ESC key for modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && selectedProject) {
        closeProject();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedProject]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
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
              <a href="#home" className="text-gray-900 hover:text-[#2D5A3D] transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-900 hover:text-[#2D5A3D] transition-colors">
                About
              </a>
              <a href="#projects" className="text-[#2D5A3D] font-medium">
                Projects
              </a>
              <a href="#contact" className="text-gray-900 hover:text-[#2D5A3D] transition-colors">
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
                <a href="#home" className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]">
                  Home
                </a>
                <a href="#about" className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]">
                  About
                </a>
                <a href="#projects" className="block px-3 py-2 text-[#2D5A3D] font-medium">
                  Projects
                </a>
                <a href="#contact" className="block px-3 py-2 text-gray-900 hover:text-[#2D5A3D]">
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-light mb-6 text-gray-900">
              Our <span className="text-[#2D5A3D]">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse portfolio of architectural excellence, from sustainable homes to innovative commercial spaces. 
              Each project reflects our commitment to beautiful, functional design.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2D5A3D] mb-2">{projects.length}+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2D5A3D] mb-2">20+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2D5A3D] mb-2">4</div>
              <div className="text-gray-600">Project Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2D5A3D] mb-2">100%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4 text-gray-900">Browse by Category</h2>
            <p className="text-gray-600">Select a category to explore specific types of projects</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`group p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === key
                    ? "border-[#2D5A3D] bg-[#2D5A3D] text-white"
                    : "border-gray-200 hover:border-[#2D5A3D] bg-white text-gray-900"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center transition-colors ${
                    selectedCategory === key ? "bg-white/20" : "bg-gray-50 group-hover:bg-[#2D5A3D]/10"
                  }`}>
                    {React.createElement(category.icon, {
                      size: 24,
                      className: selectedCategory === key ? "text-white" : "text-[#2D5A3D]"
                    })}
                  </div>
                  <h3 className="font-medium mb-2">{category.title}</h3>
                  <p className={`text-sm mb-3 ${
                    selectedCategory === key ? "text-white/80" : "text-gray-500"
                  }`}>
                    {category.count} {category.count === 1 ? 'Project' : 'Projects'}
                  </p>
                  <div className={`w-full h-0.5 rounded ${
                    selectedCategory === key ? "bg-white/30" : "bg-gray-200 group-hover:bg-[#2D5A3D]/20"
                  }`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A3D] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year === "All" ? "All Years" : year}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="size">By Size</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-[#2D5A3D] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-[#2D5A3D] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedYear !== "All" && ` from ${selectedYear}`}
            </p>
            {(searchTerm || selectedCategory !== "All" || selectedYear !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedYear("All");
                }}
                className="text-[#2D5A3D] hover:text-[#4A7C59] font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid/List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find more projects.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedYear("All");
                }}
                className="bg-[#2D5A3D] text-white px-6 py-3 rounded-lg hover:bg-[#4A7C59] transition-colors"
              >
                View All Projects
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-8"
            }>
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "hover:-translate-y-2" 
                      : "flex gap-6 items-center hover:bg-gray-50 p-6 rounded-xl"
                  }`}
                  onClick={() => openProject(project)}
                >
                  {viewMode === "grid" ? (
                    // Grid View
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#2D5A3D] text-white px-3 py-1 rounded-full text-sm font-medium">
                            {project.year}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Eye size={16} className="text-[#2D5A3D]" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-[#2D5A3D] transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-gray-500 mb-3">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <Ruler size={14} className="mr-1" />
                            {project.area}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center text-[#2D5A3D] group-hover:translate-x-2 transition-transform duration-300">
                          <span className="text-sm font-medium">View Project</span>
                          <ArrowRight size={14} className="ml-2" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <>
                      <div className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#2D5A3D] transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#2D5A3D] text-white px-3 py-1 rounded-full text-sm">
                              {project.year}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 mb-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mr-3">
                            {project.category}
                          </span>
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm mr-4">{project.location}</span>
                          <Ruler size={14} className="mr-1" />
                          <span className="text-sm">{project.area}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                            {project.features.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{project.features.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-[#2D5A3D] group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-sm font-medium">View Details</span>
                            <ArrowRight size={14} className="ml-2" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ready to Start Your <span className="text-[#4A7C59]">Project</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Let's discuss how we can bring your architectural vision to life with our proven expertise 
            and commitment to sustainable, beautiful design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#2D5A3D] text-white px-8 py-4 rounded-lg hover:bg-[#4A7C59] transition-colors duration-300">
              Start a Project
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
              Schedule Consultation
            </button>
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
                Creating beautiful, vibrant and sustainable buildings for over 20 years.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <a href="#projects" className="block text-gray-400 hover:text-white transition-colors">
                  Projects
                </a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-[#4A7C59]" />
                  <span className="text-gray-400">hla@hla.co.za</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-[#4A7C59]" />
                  <span className="text-gray-400">Johannesburg, South Africa</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HLArchitects. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeProject}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeProject}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-gray-700 transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Gallery */}
              <div className="flex-1 flex flex-col">
                {/* Main Image */}
                <div className="relative flex-1 bg-black">
                  <img
                    src={selectedProject.images[currentImageIndex]}
                    alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {selectedProject.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                    {selectedProject.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-[#2D5A3D]"
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
              <div className="lg:w-96 bg-white overflow-y-auto">
                <div className="p-8 space-y-6">
                  {/* Project Header */}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <span className="bg-[#2D5A3D] text-white px-3 py-1 rounded-full">
                        {selectedProject.category}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-[#2D5A3D]">{selectedProject.year}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedProject.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#2D5A3D]" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-sm">{selectedProject.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ruler size={18} className="text-[#2D5A3D]" />
                      <div>
                        <p className="text-sm text-gray-500">Area</p>
                        <p className="font-medium text-sm">{selectedProject.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#2D5A3D]" />
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="font-medium text-sm">{selectedProject.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 size={18} className="text-[#2D5A3D]" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-sm">{selectedProject.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Project Budget</h4>
                    <p className="text-[#2D5A3D] font-semibold">{selectedProject.budget}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Interested in a similar project?
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full bg-[#2D5A3D] text-white py-3 rounded-lg hover:bg-[#4A7C59] transition-colors duration-300">
                        Start Your Project
                      </button>
                      <button className="w-full border-2 border-[#2D5A3D] text-[#2D5A3D] py-3 rounded-lg hover:bg-[#2D5A3D] hover:text-white transition-all duration-300">
                        Get a Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HLAProjectsPage;
                