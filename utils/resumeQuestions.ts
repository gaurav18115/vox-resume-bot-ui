import { Question, ResumeSection } from '@/types/resume';

export const resumeQuestions: Record<ResumeSection, Question[]> = {
    basicDetails: [
        {
            section: 'basicDetails',
            question: "Let's start with your basic information. What's your full name?",
            expectedAnswerType: 'text'
        },
        {
            section: 'basicDetails',
            question: "What's your email address?",
            expectedAnswerType: 'email'
        },
        {
            section: 'basicDetails',
            question: "What's your phone number?",
            expectedAnswerType: 'phone'
        },
        {
            section: 'basicDetails',
            question: "Where are you located? (City, Country)",
            expectedAnswerType: 'text'
        },
        {
            section: 'basicDetails',
            question: "Do you have a LinkedIn profile? If yes, please share the URL.",
            expectedAnswerType: 'url'
        },
        {
            section: 'basicDetails',
            question: "Do you have a portfolio website? If yes, please share the URL.",
            expectedAnswerType: 'url'
        }
    ],
    education: [
        {
            section: 'education',
            question: "Let's talk about your education. What's your highest degree?",
            expectedAnswerType: 'text'
        },
        {
            section: 'education',
            question: "Which institution did you attend?",
            expectedAnswerType: 'text'
        },
        {
            section: 'education',
            question: "When did you graduate? (Year)",
            expectedAnswerType: 'date'
        },
        {
            section: 'education',
            question: "What was your GPA? (If you'd like to share)",
            expectedAnswerType: 'text'
        },
        {
            section: 'education',
            question: "Did you receive any academic achievements or awards?",
            expectedAnswerType: 'list'
        }
    ],
    workExperience: [
        {
            section: 'workExperience',
            question: "Let's discuss your work experience. What's your most recent job position?",
            expectedAnswerType: 'text'
        },
        {
            section: 'workExperience',
            question: "Which company did you work for?",
            expectedAnswerType: 'text'
        },
        {
            section: 'workExperience',
            question: "How long did you work there? (e.g., Jan 2020 - Present)",
            expectedAnswerType: 'text'
        },
        {
            section: 'workExperience',
            question: "What were your main responsibilities?",
            expectedAnswerType: 'list'
        },
        {
            section: 'workExperience',
            question: "What were your key achievements in this role?",
            expectedAnswerType: 'list'
        }
    ],
    skills: [
        {
            section: 'skills',
            question: "What technical skills do you have? (e.g., programming languages, tools, frameworks)",
            expectedAnswerType: 'list'
        },
        {
            section: 'skills',
            question: "What soft skills would you like to highlight? (e.g., communication, leadership)",
            expectedAnswerType: 'list'
        }
    ],
    projects: [
        {
            section: 'projects',
            question: "Let's talk about your projects. What's the name of your most significant project?",
            expectedAnswerType: 'text'
        },
        {
            section: 'projects',
            question: "Can you describe what this project was about?",
            expectedAnswerType: 'text'
        },
        {
            section: 'projects',
            question: "What technologies did you use in this project?",
            expectedAnswerType: 'list'
        },
        {
            section: 'projects',
            question: "Do you have a link to this project? (GitHub, live demo, etc.)",
            expectedAnswerType: 'url'
        }
    ],
    certifications: [
        {
            section: 'certifications',
            question: "Do you have any relevant certifications? What's the name of the certification?",
            expectedAnswerType: 'text'
        },
        {
            section: 'certifications',
            question: "Who issued this certification?",
            expectedAnswerType: 'text'
        },
        {
            section: 'certifications',
            question: "When did you receive this certification?",
            expectedAnswerType: 'date'
        }
    ],
    languages: [
        {
            section: 'languages',
            question: "What languages do you speak?",
            expectedAnswerType: 'list'
        },
        {
            section: 'languages',
            question: "What's your proficiency level in each language? (e.g., Native, Fluent, Intermediate)",
            expectedAnswerType: 'text'
        }
    ]
};

export const sectionOrder: ResumeSection[] = [
    'basicDetails',
    'education',
    'workExperience',
    'skills',
    'projects',
    'certifications',
    'languages'
]; 