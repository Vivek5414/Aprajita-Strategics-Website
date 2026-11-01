export type ServiceCategory = {
  slug: string;
  number: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
};

export type Service = {
  slug: string;
  title: string;
  categorySlug: string;
  icon: string;
  shortDescription: string;
  description: string;
  scope: string[];
  capabilities: string[];
  applications: string[];
  approach: string;
  editorialReview: string[];
  seo: {
    title: string;
    description: string;
  };
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "project-delivery-commercial-planning",
    number: "01",
    title: "Project Delivery & Commercial Planning",
    description:
      "Planning and coordination considerations for project scope, commercial inputs, schedules, and delivery interfaces.",
    image: {
      src: "/images/services/project-delivery.svg",
      alt: "Illustration of coordinated project plans and delivery milestones",
    },
  },
  {
    slug: "architecture-interiors-visualization",
    number: "02",
    title: "Architecture, Interiors & Visualization",
    description:
      "Design and visualization disciplines that help shape, communicate, and coordinate built-environment proposals.",
    image: {
      src: "/images/services/architecture-visualization.svg",
      alt: "Illustration of architectural plans and a building elevation",
    },
  },
  {
    slug: "structural-building-systems",
    number: "03",
    title: "Structural & Building Systems",
    description:
      "Structural and building-services design considerations, coordinated against the confirmed needs of each project.",
    image: {
      src: "/images/services/building-systems.svg",
      alt: "Illustration of a building frame with coordinated service routes",
    },
  },
  {
    slug: "industrial-energy-environmental-systems",
    number: "04",
    title: "Industrial, Energy & Environmental Systems",
    description:
      "Specialist industrial and environmental system topics identified in the original service catalogue.",
    image: {
      src: "/images/services/industrial-environmental.svg",
      alt: "Illustration of industrial infrastructure and environmental systems",
    },
  },
];

export const services: Service[] = [
  {
    slug: "project-management-epcm-epc",
    title: "Project Management (EPCM/EPC)",
    categorySlug: "project-delivery-commercial-planning",
    icon: "ClipboardList",
    shortDescription:
      "Supports project planning, coordination and management across agreed stages, with scope, resources and responsibilities defined for the engagement.",
    description:
      "Project management can involve coordination of requirements, contributors, schedules, and decisions. EPCM and EPC describe distinct delivery and contractual models; the applicable role, authority, and responsibilities must be agreed before work begins.",
    scope: [
      "Review the project brief, objectives, constraints, and interfaces.",
      "Develop or coordinate project scopes, milestones, and schedules where agreed.",
      "Track decisions, actions, and progress information for the agreed role.",
      "Coordinate design, procurement, or construction interfaces only when included in the contract.",
    ],
    capabilities: [
      "Project scope and milestone coordination",
      "Stakeholder and discipline interfaces",
      "Progress and decision tracking",
    ],
    applications: [
      "Building and facility projects",
      "Industrial project planning",
      "Infrastructure delivery coordination",
    ],
    approach:
      "Start with the agreed brief and responsibility matrix. Define reporting, decision paths, and interfaces before coordinating delivery activities.",
    editorialReview: [
      "Confirm whether EPCM, EPC, project management, procurement, or construction roles are actually offered.",
      "Confirm contract boundaries, decision authority, and delivery responsibilities.",
    ],
    seo: {
      title: "Project Management & EPCM/EPC | Aprajita Strategics",
      description:
        "Explore project management and EPCM/EPC coordination support. Delivery roles and responsibilities are defined for each engagement.",
    },
  },
  {
    slug: "auditing-estimation-costing",
    title: "Auditing, Estimation & Costing",
    categorySlug: "project-delivery-commercial-planning",
    icon: "Calculator",
    shortDescription:
      "Project assessment, quantity estimation and cost-planning support based on available information and defined project requirements.",
    description:
      "This service area may cover review of project documentation, quantities, estimates, or cost assumptions. The audit type, estimating basis, deliverables, and independence requirements should be defined for each assignment.",
    scope: [
      "Review project information and cost inputs supplied for the assignment.",
      "Prepare or review estimates against documented assumptions, if agreed.",
      "Identify information gaps and interfaces affecting the estimate.",
      "Present findings with stated inclusions, exclusions, and limitations.",
    ],
    capabilities: [
      "Estimate preparation or review",
      "Quantity and cost-input analysis",
      "Documentation of assumptions and exclusions",
    ],
    applications: [
      "Construction cost planning",
      "Building and infrastructure estimates",
      "Project documentation review",
    ],
    approach:
      "Establish the estimate purpose, available information, measurement basis, and exclusions first; communicate assumptions alongside any review.",
    editorialReview: [
      "Confirm the meaning and scope of auditing, including whether it is technical, commercial, or financial.",
      "Confirm estimating methods, deliverables, and whether quantity surveying or tender review is offered.",
    ],
    seo: {
      title: "Auditing, Estimation & Costing | Aprajita Strategics",
      description:
        "Learn about project estimation, costing, and review support. Engagement scope and deliverables are agreed against available project information.",
    },
  },
  {
    slug: "architectural-design",
    title: "Architectural Designing",
    categorySlug: "architecture-interiors-visualization",
    icon: "Building2",
    shortDescription:
      "Architectural design planning that considers space, functionality, aesthetics and the intended use of the built environment.",
    description:
      "Architectural design may progress from briefing and spatial planning through design development and coordinated documentation. The stages, building types, approval responsibilities, and deliverables depend on the confirmed engagement.",
    scope: [
      "Review the brief, site information, intended use, and design constraints.",
      "Develop spatial planning or design options where included.",
      "Coordinate design information with relevant project disciplines.",
      "Prepare agreed drawings, schedules, or design documentation.",
    ],
    capabilities: [
      "Architectural brief and spatial planning",
      "Concept and design development",
      "Design coordination and documentation",
    ],
    applications: [
      "Commercial and workplace buildings",
      "Residential and hospitality buildings",
      "Industrial and institutional facilities",
    ],
    approach:
      "Translate the approved brief into coordinated design stages, confirming decisions, inputs, and review points with the client and project team.",
    editorialReview: [
      "Confirm architectural stages, building types, statutory submission roles, and design responsibility.",
      "Confirm whether site analysis, interior design, or construction-stage services are included.",
    ],
    seo: {
      title: "Architectural Design & Planning | Aprajita Strategics",
      description:
        "Explore architectural planning and design support shaped around each project brief, site context, and agreed deliverables.",
    },
  },
  {
    slug: "3d-visualization-engineering-design",
    title: "3D Visualization & Engineering Design",
    categorySlug: "architecture-interiors-visualization",
    icon: "Box",
    shortDescription:
      "Three-dimensional visualization and engineering design to communicate concepts, clarify spatial relationships and support coordination.",
    description:
      "Three-dimensional visualization can support the communication of design proposals, while engineering design addresses defined technical requirements. Confirm whether models are illustrative, coordinated, or suitable for technical documentation before relying on them for downstream use.",
    scope: [
      "Confirm the intended use, audience, and level of detail for the model or visualization.",
      "Develop visual material from approved project inputs, where included.",
      "Coordinate design information with identified engineering disciplines.",
      "Record model assumptions and limitations for the agreed deliverable.",
    ],
    capabilities: [
      "3D visualization of approved design inputs",
      "Engineering-design coordination",
      "Model and documentation review against agreed uses",
    ],
    applications: [
      "Building concept communication",
      "Facility and engineering coordination",
      "Design review and presentation",
    ],
    approach:
      "Agree the model purpose and information requirements before production; distinguish presentation visualization from coordinated engineering information.",
    editorialReview: [
      "Confirm software, disciplines, model detail, and whether BIM or construction documentation is offered.",
      "Confirm that visualizations are not represented as verified engineering or as-built information unless validated.",
    ],
    seo: {
      title: "3D Visualization & Engineering Design | Aprajita Strategics",
      description:
        "Discover 3D visualization and engineering design coordination, with model purpose and technical deliverables defined for each brief.",
    },
  },
  {
    slug: "interior-design-execution",
    title: "Interior Designing & Execution",
    categorySlug: "architecture-interiors-visualization",
    icon: "Sofa",
    shortDescription:
      "Interior planning and design considering space use, functionality, materials, aesthetics and agreed execution coordination.",
    description:
      "Interior planning and design can address how spaces are organized, finished, and coordinated with the wider building. The word “execution” may imply procurement, installation, or site delivery, so those responsibilities should be confirmed explicitly.",
    scope: [
      "Review the interior brief, user requirements, and existing building information.",
      "Develop space-planning or interior-design information when agreed.",
      "Coordinate finishes and interfaces with relevant building disciplines.",
      "Include procurement, installation, or site coordination only when contractually confirmed.",
    ],
    capabilities: [
      "Interior brief and space-planning coordination",
      "Design development and finish coordination",
      "Interface planning with building systems",
    ],
    applications: [
      "Commercial and workplace interiors",
      "Residential interiors",
      "Hospitality and public-facing spaces",
    ],
    approach:
      "Establish user needs, project constraints, and design responsibilities first, then coordinate interiors with the approved architectural and building-services information.",
    editorialReview: [
      "Confirm whether the company provides design only, procurement, installation, execution management, or handover.",
      "Confirm applicable building types and interior deliverables.",
    ],
    seo: {
      title: "Interior Design & Execution | Aprajita Strategics",
      description:
        "Explore interior design support from Aprajita Strategics. Design and implementation responsibilities are defined for each engagement.",
    },
  },
  {
    slug: "facade-design-execution",
    title: "Facade Designing & Execution",
    categorySlug: "architecture-interiors-visualization",
    icon: "PanelsTopLeft",
    shortDescription:
      "Façade design coordination addressing architectural intent, material considerations, functional performance and project requirements.",
    description:
      "Façade planning involves interfaces between the building envelope, structure, performance criteria, and architectural intent. Engineering, testing, specification, procurement, and installation responsibilities must be identified before describing a complete façade delivery service.",
    scope: [
      "Review architectural intent and project façade requirements.",
      "Coordinate façade interfaces with structure and building systems.",
      "Prepare or review agreed design information and system details.",
      "Include testing, procurement, installation, or site services only when confirmed.",
    ],
    capabilities: [
      "Façade design coordination",
      "Building-envelope interface review",
      "Material or system documentation where included",
    ],
    applications: [
      "Commercial building envelopes",
      "Residential and hospitality buildings",
      "Institutional and mixed-use buildings",
    ],
    approach:
      "Confirm performance criteria, design responsibility, and interfaces early; align façade information with the architectural and structural design basis.",
    editorialReview: [
      "Confirm façade engineering, system selection, testing, shop-drawing review, and installation scope.",
      "Confirm whether “execution” means direct construction, contractor coordination, or another role.",
    ],
    seo: {
      title: "Facade Design & Execution | Aprajita Strategics",
      description:
        "Learn about façade design coordination and project-specific implementation support, subject to agreed engineering responsibilities.",
    },
  },
  {
    slug: "structural-design",
    title: "Structural Designing",
    categorySlug: "structural-building-systems",
    icon: "Network",
    shortDescription:
      "Structural design developed against project requirements, engineering principles, structural configuration and defined technical criteria.",
    description:
      "Structural design work depends on the building or infrastructure type, design criteria, available information, and assigned professional responsibilities. Specific systems, analysis methods, and approval roles should be confirmed for each project.",
    scope: [
      "Review project inputs, structural criteria, and relevant interfaces.",
      "Develop or coordinate structural design information where agreed.",
      "Coordinate structural requirements with architectural and building-services design.",
      "Prepare agreed calculations, drawings, or design documentation if included.",
    ],
    capabilities: [
      "Structural design coordination",
      "Design-basis and interface review",
      "Structural documentation as agreed",
    ],
    applications: [
      "Building structures",
      "Industrial facilities",
      "Infrastructure structures, subject to confirmed scope",
    ],
    approach:
      "Agree the design basis, input assumptions, discipline interfaces, and review responsibilities before developing structural information.",
    editorialReview: [
      "Confirm structural systems, codes, building types, calculation and detailing scope, and professional sign-off roles.",
      "Confirm whether existing-structure assessment or construction-stage support is offered.",
    ],
    seo: {
      title: "Structural Design Services | Aprajita Strategics",
      description:
        "Explore structural design coordination based on confirmed project criteria, structural systems, and professional responsibilities.",
    },
  },
  {
    slug: "mep-design-execution",
    title: "MEP Designing & Execution",
    categorySlug: "structural-building-systems",
    icon: "Cable",
    shortDescription:
      "Coordinated mechanical, electrical and plumbing system planning and design, with execution responsibilities defined for the project.",
    description:
      "MEP design covers building services that must be coordinated with architecture, structure, and project operations. Confirm which disciplines and delivery stages are included; do not assume installation, commissioning, or life-safety design is part of the service.",
    scope: [
      "Review building-services requirements and available project information.",
      "Coordinate agreed mechanical, electrical, and plumbing design inputs.",
      "Identify interfaces and spatial coordination requirements.",
      "Include installation, testing, or commissioning only when expressly agreed.",
    ],
    capabilities: [
      "MEP requirements and interface coordination",
      "Design documentation for confirmed disciplines",
      "Coordination with architectural and structural information",
    ],
    applications: [
      "Commercial and workplace buildings",
      "Residential and hospitality buildings",
      "Industrial and institutional facilities",
    ],
    approach:
      "Define the systems and design stages in scope, then coordinate layouts and interfaces against the current architectural and structural information.",
    editorialReview: [
      "Confirm the mechanical, electrical, plumbing, fire, and life-safety disciplines actually provided.",
      "Confirm design, procurement, installation, testing, and commissioning roles.",
    ],
    seo: {
      title: "MEP Design & Execution | Aprajita Strategics",
      description:
        "Explore MEP design coordination for confirmed building-services disciplines. Execution and commissioning responsibilities are project-specific.",
    },
  },
  {
    slug: "hvac-design-execution",
    title: "HVAC Designing & Execution",
    categorySlug: "structural-building-systems",
    icon: "Wind",
    shortDescription:
      "Heating, ventilation and air-conditioning system planning and design coordinated to project requirements and agreed responsibilities.",
    description:
      "Heating, ventilation, and air-conditioning design depends on occupancy, building use, environmental criteria, and system selection. Confirm the calculation basis, equipment scope, controls, installation, and commissioning responsibilities before describing deliverables.",
    scope: [
      "Review project use, HVAC requirements, and available design inputs.",
      "Coordinate agreed HVAC layouts and system design information.",
      "Review interfaces with architecture and other building services.",
      "Include equipment selection, installation, or commissioning only when agreed.",
    ],
    capabilities: [
      "HVAC requirement coordination",
      "System-layout and design documentation as agreed",
      "Building-services interface review",
    ],
    applications: [
      "Commercial and workplace buildings",
      "Residential and hospitality facilities",
      "Industrial spaces, where environmental requirements are confirmed",
    ],
    approach:
      "Establish occupancy and project criteria first; coordinate the HVAC design basis and interfaces with the client and relevant disciplines.",
    editorialReview: [
      "Confirm whether load calculations, equipment selection, controls, energy analysis, installation, and commissioning are offered.",
      "Confirm any controlled-environment or industrial HVAC specialism before publishing it.",
    ],
    seo: {
      title: "HVAC Design & Execution | Aprajita Strategics",
      description:
        "Learn about HVAC design coordination from Aprajita Strategics. System selection and delivery responsibilities are set by project requirements.",
    },
  },
  {
    slug: "solar-plant-design-execution",
    title: "Solar Plant Designing & Execution",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Sun",
    shortDescription:
      "Solar energy system planning and design coordination shaped around the project brief and implementation requirements.",
    description:
      "Solar plant design depends on site conditions, the intended application, electrical interfaces, and applicable approvals. Grid connection, yield estimates, supply, installation, and commissioning must not be assumed without a defined scope.",
    scope: [
      "Review site information and the client’s project objectives.",
      "Coordinate agreed preliminary or detailed solar design information.",
      "Identify interfaces with electrical systems and project infrastructure.",
      "Include approvals, procurement, installation, or commissioning only when confirmed.",
    ],
    capabilities: [
      "Solar project requirement coordination",
      "Design and electrical interface planning as agreed",
      "Implementation coordination within the confirmed role",
    ],
    applications: [
      "Commercial property",
      "Industrial facilities",
      "Other client sites subject to technical and regulatory review",
    ],
    approach:
      "Confirm site, plant type, connection assumptions, and design responsibilities before coordinating a project-specific system proposal.",
    editorialReview: [
      "Confirm rooftop or ground-mounted scope, capacity range, yield analysis, grid interface, and regulatory responsibilities.",
      "Confirm whether procurement, installation, operation, and maintenance are offered.",
    ],
    seo: {
      title: "Solar Plant Design & Execution | Aprajita Strategics",
      description:
        "Explore solar project design coordination from Aprajita Strategics, with system type, electrical interfaces, and implementation scope confirmed.",
    },
  },
  {
    slug: "furnace-design-execution",
    title: "Furnace Designing & Execution",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Flame",
    shortDescription:
      "Furnace engineering design planning and technical coordination for defined industrial applications and project requirements.",
    description:
      "Furnace design is dependent on process requirements, operating conditions, equipment type, and safety considerations. The service scope should identify whether support is conceptual, engineering, equipment-related, or implementation-focused.",
    scope: [
      "Document the process requirements and available project inputs.",
      "Coordinate agreed furnace design information and discipline interfaces.",
      "Identify operating, utility, and facility interfaces within the assigned scope.",
      "Include equipment supply, installation, or commissioning only when confirmed.",
    ],
    capabilities: [
      "Furnace project requirement coordination",
      "Design information and facility-interface planning",
      "Implementation coordination where agreed",
    ],
    applications: [
      "Industrial process facilities",
      "Manufacturing environments with thermal equipment",
      "Other applications subject to process and safety review",
    ],
    approach:
      "Begin with the process brief, operating criteria, and responsibility boundaries; coordinate technical interfaces only within the agreed engineering remit.",
    editorialReview: [
      "Confirm furnace types, thermal/process design scope, fuel systems, emissions, safety standards, and engineering responsibility.",
      "Confirm equipment, installation, and commissioning roles.",
    ],
    seo: {
      title: "Industrial Furnace Design & Execution | Aprajita Strategics",
      description:
        "Learn about furnace design coordination for confirmed industrial applications. Equipment and implementation responsibilities are project-specific.",
    },
  },
  {
    slug: "clean-room-partition",
    title: "Clean Room Partition",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "PanelsTopLeft",
    shortDescription:
      "Cleanroom partition planning that considers layout, controlled-environment requirements and application-specific specifications.",
    description:
      "Partition systems for controlled environments must be coordinated with room use, finishes, doors, ceilings, and environmental systems. No classification, regulatory compliance, validation, or certification is implied by this service description.",
    scope: [
      "Review the intended room use and project-provided environmental criteria.",
      "Coordinate partition layouts and interfaces with adjacent systems.",
      "Prepare agreed system or detail information where included.",
      "Include installation, testing, validation, or compliance activities only when confirmed.",
    ],
    capabilities: [
      "Partition layout coordination",
      "Interface planning with doors, ceilings, and services",
      "System documentation as agreed",
    ],
    applications: [
      "Manufacturing environments",
      "Laboratory or healthcare spaces, subject to requirements review",
      "Other controlled environments confirmed by the client",
    ],
    approach:
      "Define the room criteria and required environmental performance with the client, then coordinate partition interfaces with the project design team.",
    editorialReview: [
      "Confirm clean-room classifications, partition systems, environmental performance, and applicable standards.",
      "Confirm testing, validation, regulatory compliance, and installation responsibilities.",
    ],
    seo: {
      title: "Clean Room Partition Planning | Aprajita Strategics",
      description:
        "Explore clean-room partition planning and interface coordination. Environmental criteria, testing, and compliance scope require project confirmation.",
    },
  },
  {
    slug: "industrial-flooring",
    title: "Industrial Flooring",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Layers3",
    shortDescription:
      "Industrial flooring solutions planned around operational use, surface characteristics, durability requirements and site conditions.",
    description:
      "The original service catalogue references epoxy and polyurethane flooring. System choice depends on the substrate, use, operating conditions, and performance criteria. Supply, installation, testing, and warranty responsibilities require confirmation.",
    scope: [
      "Review the area use, substrate information, and client-specified criteria.",
      "Coordinate flooring-system requirements and interfaces where agreed.",
      "Document system options or details if included in the engagement.",
      "Include substrate preparation, installation, testing, or warranty only when confirmed.",
    ],
    capabilities: [
      "Industrial flooring requirement coordination",
      "Epoxy or polyurethane system consideration, subject to confirmation",
      "Interface planning with facility operations",
    ],
    applications: [
      "Industrial and manufacturing floors",
      "Warehousing and service areas",
      "Other high-use areas based on project criteria",
    ],
    approach:
      "Confirm operating conditions, substrate information, and performance criteria before coordinating a flooring system or installation scope.",
    editorialReview: [
      "Confirm epoxy, PU, and other flooring types actually offered.",
      "Confirm substrate preparation, installation, testing, maintenance, and warranty responsibilities.",
    ],
    seo: {
      title: "Industrial Flooring Systems | Aprajita Strategics",
      description:
        "Learn about industrial flooring planning, including system options subject to confirmed substrate, facility, and project requirements.",
    },
  },
  {
    slug: "water-wastewater-treatment",
    title: "Water Treatment & Wastewater Treatment",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Droplets",
    shortDescription:
      "Water and wastewater treatment planning shaped around intended use, treatment objectives and agreed project scope.",
    description:
      "The original service catalogue references reverse osmosis (RO), effluent treatment plants (ETP), sewage treatment plants (STP), and zero liquid discharge (ZLD). Confirm which technologies, project stages, and operating responsibilities are actually included.",
    scope: [
      "Review water or wastewater characteristics and client-defined objectives.",
      "Coordinate agreed treatment-system planning or design information.",
      "Identify interfaces with utilities, processes, and facility infrastructure.",
      "Include regulatory submissions, equipment, installation, commissioning, or operation only when confirmed.",
    ],
    capabilities: [
      "Treatment requirement and process-interface coordination",
      "RO, ETP, STP, or ZLD planning where confirmed",
      "Project documentation within the agreed discipline scope",
    ],
    applications: [
      "Industrial facilities",
      "Commercial or institutional sites",
      "Other sites with defined water-treatment requirements",
    ],
    approach:
      "Define influent information, intended treatment objectives, discharge or reuse criteria, and regulatory interfaces before considering system options.",
    editorialReview: [
      "Confirm RO, ETP, STP, ZLD, process design, and operating services actually offered.",
      "Confirm applicable local requirements and who is responsible for compliance, testing, and approvals.",
    ],
    seo: {
      title: "Water & Wastewater Treatment | Aprajita Strategics",
      description:
        "Explore water and wastewater treatment planning for confirmed project requirements, with technologies and delivery responsibilities agreed per brief.",
    },
  },
  {
    slug: "air-pollution-control-systems",
    title: "Pollution Air Control Systems",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Wind",
    shortDescription:
      "Air pollution control system planning and engineering coordination in support of project-defined environmental requirements.",
    description:
      "This entry clarifies the original label “Pollution Air Control Systems.” System selection depends on the process, emissions characteristics, operating conditions, and applicable requirements. No particular system or compliance result is implied.",
    scope: [
      "Review process and emissions information provided for the project.",
      "Coordinate agreed air-control system planning or design inputs.",
      "Identify interfaces with process equipment, utilities, and facility layout.",
      "Include monitoring, approvals, installation, or commissioning only when confirmed.",
    ],
    capabilities: [
      "Emissions requirement coordination",
      "Air-control system planning within the agreed scope",
      "Process and facility interface review",
    ],
    applications: [
      "Industrial process facilities",
      "Manufacturing sites with defined air-control needs",
      "Other applications subject to technical and regulatory review",
    ],
    approach:
      "Establish process inputs, emissions criteria, and applicable responsibilities before coordinating system options and project interfaces.",
    editorialReview: [
      "Confirm pollutants, system types, filtration or scrubber design, monitoring, and regulatory scope.",
      "Confirm the official company service name and whether installation or compliance support is offered.",
    ],
    seo: {
      title: "Air Pollution Control Systems | Aprajita Strategics",
      description:
        "Learn about air-pollution-control planning and coordination for confirmed industrial requirements and agreed project responsibilities.",
    },
  },
  {
    slug: "green-building-solutions",
    title: "Green Building Solutions",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "Leaf",
    shortDescription:
      "Building and infrastructure planning that considers resource efficiency, material choices and suitable sustainable design principles.",
    description:
      "Sustainability considerations may be incorporated into planning and design according to the client’s objectives and project constraints. No environmental performance, rating, or certification is implied unless explicitly verified and included.",
    scope: [
      "Clarify project sustainability objectives and relevant constraints.",
      "Coordinate agreed design considerations related to resource use.",
      "Document selected strategies or assumptions where included.",
      "Include performance modeling, rating-system advisory, or certification support only when confirmed.",
    ],
    capabilities: [
      "Sustainability objective coordination",
      "Resource-use considerations within the agreed design scope",
      "Documentation of selected project strategies",
    ],
    applications: [
      "Commercial and workplace buildings",
      "Residential and institutional projects",
      "Industrial facilities, subject to project objectives",
    ],
    approach:
      "Translate client-defined sustainability objectives into coordinated project considerations and state the boundaries of any analysis or advice.",
    editorialReview: [
      "Confirm energy, water, materials, performance modeling, and rating-system capabilities.",
      "Do not publish certification names, quantified savings, or environmental claims without substantiation.",
    ],
    seo: {
      title: "Green Building & Sustainability Planning | Aprajita Strategics",
      description:
        "Explore sustainability-focused building planning from Aprajita Strategics, with project objectives and advisory scope clearly defined.",
    },
  },
  {
    slug: "waterproofing-solutions",
    title: "Waterproofing Solutions",
    categorySlug: "industrial-energy-environmental-systems",
    icon: "ShieldCheck",
    shortDescription:
      "Waterproofing system selection and application planning based on building conditions, exposure and project specifications.",
    description:
      "Waterproofing requirements vary by location, substrate, exposure, and adjoining construction. This page describes a potential planning and coordination scope; system specification, installation, inspection, and warranty obligations require confirmation.",
    scope: [
      "Review the location, substrate information, and water-ingress requirements.",
      "Coordinate waterproofing details with structure and adjacent finishes.",
      "Document agreed system interfaces or design information where included.",
      "Include material supply, installation, testing, inspection, or warranty only when confirmed.",
    ],
    capabilities: [
      "Waterproofing requirement coordination",
      "Detail and construction-interface planning",
      "System documentation within the agreed scope",
    ],
    applications: [
      "Roof and terrace areas",
      "Basements and below-grade structures",
      "Wet areas and other project-defined locations",
    ],
    approach:
      "Identify exposure conditions, substrates, movement joints, and interfaces before coordinating a project-specific waterproofing detail or system.",
    editorialReview: [
      "Confirm locations and waterproofing systems actually offered.",
      "Confirm installation, testing, inspection, maintenance, and warranty roles.",
    ],
    seo: {
      title: "Waterproofing Design & Coordination | Aprajita Strategics",
      description:
        "Learn about waterproofing planning and interface coordination, with system selection and implementation roles set by project requirements.",
    },
  },
];

export const legacyServiceRedirects: Record<string, string> = {
  "engineering-design": "/services",
  "industrial-infrastructure": "/services",
  "project-management": "/services/project-management-epcm-epc",
};
