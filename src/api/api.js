import { supabase } from "../lib/supabase";
import { imageUrl } from "../lib/utils";
// --- MOCK DATA ---
// Fallback data in case Supabase is not available
const categories = {
  Residential: {
    title: "Residential Projects",
    description:
      "Custom homes and residential developments that enhance living experiences through thoughtful design, sustainable materials, and seamless integration with the natural environment.",
    icon: "Home",
    stats: {
      completed: "15+",
      years: "20",
      specialty: "Sustainable Family Homes",
    },
  },
  Commercial: {
    title: "Commercial Projects",
    description:
      "Office buildings and commercial spaces that drive business success through innovative design, flexible workspaces, and cutting-edge technology infrastructure.",
    icon: "Building2",
    stats: {
      completed: "25+",
      years: "20",
      specialty: "Corporate Headquarters",
    },
  },
  Education: {
    title: "Educational Projects",
    description:
      "Learning environments that inspire and facilitate education through flexible classrooms, collaborative spaces, and sustainable design elements that foster creativity.",
    icon: "GraduationCap",
    stats: {
      completed: "10+",
      years: "15",
      specialty: "Modern Learning Centers",
    },
  },
  "Container Architecture": {
    title: "Container Architecture",
    description:
      "Innovative solutions using sustainable container construction that transforms shipping containers into modern, functional spaces through adaptive reuse principles.",
    icon: "Container",
    stats: {
      completed: "8+",
      years: "5",
      specialty: "Sustainable Construction",
    },
  },
};

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Modern Residential Design",
    category: "Residential",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Commercial Excellence",
    category: "Commercial",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Educational Spaces",
    category: "Education",
  },
];

// Expanded project data
const projects = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Sustainable Family Home",
    category: "Residential",
    year: "2024",
    location: "Johannesburg, South Africa",
    area: "350 sqm",
    budget: "R 2.5M - R 3.5M",
    status: "Completed",
    description:
      "A modern sustainable family home featuring natural materials, energy-efficient systems, and seamless indoor-outdoor living spaces. This project showcases our commitment to environmental responsibility while maintaining luxury and comfort.",
    features: [
      "Solar panels",
      "Rainwater harvesting",
      "Natural ventilation",
      "Green roof",
    ],
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
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Corporate Headquarters",
    category: "Commercial",
    year: "2023",
    location: "Sandton, Johannesburg",
    area: "2,500 sqm",
    budget: "R 15M - R 20M",
    status: "Completed",
    description:
      "A striking corporate headquarters designed to inspire innovation and collaboration. Features include flexible workspaces, green terraces, and state-of-the-art technology infrastructure.",
    features: [
      "Smart building systems",
      "Green terraces",
      "Flexible workspaces",
      "Conference facilities",
    ],
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
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Modern Learning Center",
    category: "Education",
    year: "2024",
    location: "Cape Town, South Africa",
    area: "1,800 sqm",
    budget: "R 8M - R 12M",
    status: "Completed",
    description:
      "An innovative educational facility designed to foster creative learning and community engagement. Features flexible classrooms, collaborative spaces, and sustainable design elements.",
    features: [
      "Flexible classrooms",
      "Library spaces",
      "Outdoor learning areas",
      "Sustainable materials",
    ],
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
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Innovative Container Complex",
    category: "Container Architecture",
    year: "2023",
    location: "Pretoria, South Africa",
    area: "450 sqm",
    budget: "R 1.5M - R 2.5M",
    status: "Completed",
    description:
      "A groundbreaking container architecture project that transforms shipping containers into modern, functional spaces. This project demonstrates sustainable construction methods and adaptive reuse principles.",
    features: [
      "Modular design",
      "Sustainable construction",
      "Quick assembly",
      "Cost-effective",
    ],
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
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Urban Residential Tower",
    category: "Residential",
    year: "2024",
    location: "Johannesburg CBD",
    area: "8,500 sqm",
    budget: "R 50M+",
    status: "Completed",
    description:
      "A luxury residential tower that redefines urban living with panoramic views, premium amenities, and sustainable design features integrated throughout the building.",
    features: [
      "Panoramic views",
      "Premium amenities",
      "Sustainable systems",
      "Security features",
    ],
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
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Retail Development",
    category: "Commercial",
    year: "2023",
    location: "Durban, South Africa",
    area: "3,200 sqm",
    budget: "R 12M - R 18M",
    status: "Completed",
    description:
      "A contemporary retail development that creates an engaging shopping experience through thoughtful design, natural lighting, and seamless flow between indoor and outdoor spaces.",
    features: [
      "Natural lighting",
      "Indoor-outdoor flow",
      "Retail optimization",
      "Parking solutions",
    ],
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
    image:
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Eco-Friendly Residence",
    category: "Residential",
    year: "2022",
    location: "Stellenbosch, South Africa",
    area: "280 sqm",
    budget: "R 2M - R 3M",
    status: "Completed",
    description:
      "An environmentally conscious home design that maximizes natural light, incorporates renewable energy systems, and uses locally sourced materials.",
    features: [
      "LEED certified",
      "Solar energy",
      "Local materials",
      "Water conservation",
    ],
    images: [
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752734-b1db11bed0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "University Science Building",
    category: "Education",
    year: "2022",
    location: "Wits University, Johannesburg",
    area: "3,500 sqm",
    budget: "R 25M - R 35M",
    status: "Completed",
    description:
      "A state-of-the-art science facility designed to support advanced research and collaborative learning with specialized laboratories and lecture halls.",
    features: [
      "Research labs",
      "Lecture theatres",
      "Collaborative spaces",
      "Specialized equipment",
    ],
    images: [
      "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

// --- API FUNCTIONS ---

/**
 * Fetches features for a specific project from Supabase
 * @param {string} projectId - The UUID of the project to fetch features for
 * @returns {Promise<Array>} Array of feature objects with name and description
 */
export async function getProjectFeatures(projectId) {
  const { data, error } = await supabase
    .from("project_features")
    .select("feature_name, feature_description, feature_category")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetches all projects from Supabase and formats them for the UI
 * @returns {Promise<Array>} Array of project objects formatted for the UI
 */
export const getProjects = async () => {
  try {
    // Fetch projects with related data in a single query
    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_categories:category_id (name, slug),
        project_images (image_url, is_featured)
      `
      )
      .order("start_date", { ascending: false });

    if (error) throw error;

    if (!projects) return [];

    // Transform the data to match the UI requirements
    return projects.map((project) => {
      // Find the featured image or fall back to the first image
      const primaryImage =
        //project.project_images?.find((img) => img.is_featured) ||
        project.featured_image_url || project.project_images?.[0].image_url;

      // Extract year from start_date or use current year as fallback
      const projectYear = project.actual_completion_date
        ? new Date(project.actual_completion_date).getFullYear().toString()
        : new Date().getFullYear().toString();

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        year: projectYear,
        category: project.project_categories?.name || "Uncategorized",
        image:
          imageUrl(primaryImage) ||
          "https://placehold.co/600x400?text=No+Image",
        // Include additional fields that might be needed by the UI
        location: project.location,
        slug: project.slug,
        is_featured: project.is_featured,
        images: project.project_images.map((image) =>
          imageUrl(image.image_url)
        ),
        // Keep the original project data in a separate field in case it's needed
        _raw: project,
      };
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    // Fallback to mock data in case of error
    return projects;
  }
};

export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 300); // Simulate network delay
  });
};

export const getHeroSlides = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(heroSlides);
    }, 200); // Simulate network delay
  });
};

export const getProjectsByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProjects = projects.filter((p) => p.category === category);
      resolve(filteredProjects);
    }, 400); // Simulate network delay
  });
};
