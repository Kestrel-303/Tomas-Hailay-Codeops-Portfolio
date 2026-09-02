export const projectsData = [
  {
    id: 'libra',
    title: 'Libra — Library Management System',
    shortDescription: 'A streamlined library management platform designed for cataloging books, managing member borrowing, and tracking inventory.',
    fullDescription: 'Libra is a comprehensive backend-driven web application built with Python and Django. It automates essential library operations including book cataloging, member registration, reservation queues, fine calculation, and automated email notifications for overdue items.',
    category: 'python-django',
    categoryName: 'Python / Django',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    tags: ['Python', 'Django', 'SQLite', 'HTML/CSS', 'Bootstrap'],
    liveUrl: 'https://github.com/Kestrel-303',
    githubUrl: 'https://github.com/Kestrel-303',
    featured: true,
    features: [
      'Automated book catalog search and filtering by ISBN, author, or genre',
      'Member management system with role-based permissions (Admin, Student, Staff)',
      'Borrowing & return queue system with automatic overdue penalty tracking',
      'Dashboard analytics for popular books and borrowing statistics'
    ]
  },
  {
    id: 'school-management',
    title: 'School Management System',
    shortDescription: 'A high-performance full-stack web portal for student records, course enrollment, and academic performance tracking.',
    fullDescription: 'A modern, scalable school management platform leveraging FastAPI for lightning-fast asynchronous REST APIs and React for a dynamic, reactive user interface. Enables administrators, teachers, and students to seamlessly interact with academic records.',
    category: 'react-fastapi',
    categoryName: 'FastAPI / React',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'FastAPI', 'Python', 'JavaScript', 'PostgreSQL', 'Tailwind CSS'],
    liveUrl: 'https://github.com/Kestrel-303',
    githubUrl: 'https://github.com/Kestrel-303',
    featured: true,
    features: [
      'Asynchronous RESTful APIs with OpenAPI documentation via FastAPI',
      'Interactive React dashboard for grade entry and student attendance',
      'JWT-based secure authentication and role-based access control',
      'Exportable academic transcript generation and report cards'
    ]
  },
  {
    id: 'taxi-management',
    title: 'Taxi Fleet Management System',
    shortDescription: 'An operational web platform designed for monitoring taxi fleets, driver dispatching, and route scheduling.',
    fullDescription: 'An enterprise fleet operational suite that helps dispatchers manage active taxi drivers, assign trip schedules, monitor maintenance logs, and calculate daily revenue metrics in real time.',
    category: 'python-django',
    categoryName: 'Python / Web Apps',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    tags: ['Python', 'JavaScript', 'SQL', 'HTML5/CSS3', 'REST API'],
    liveUrl: 'https://github.com/Kestrel-303',
    githubUrl: 'https://github.com/Kestrel-303',
    featured: true,
    features: [
      'Real-time driver status tracking (Available, On-Trip, Off-Duty)',
      'Automated fare calculation and trip logging algorithms',
      'Fleet vehicle maintenance scheduler and expense recorder',
      'Dispatcher interface with interactive search and status updates'
    ]
  }
];

export const projectCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'python-django', label: 'Python & Django' },
  { id: 'react-fastapi', label: 'React & FastAPI' }
];
