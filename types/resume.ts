export interface Resume {
    basicDetails: {
        name: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        portfolio?: string;
    };
    education: {
        degree: string;
        institution: string;
        year: string;
        gpa?: string;
        achievements?: string[];
    }[];
    workExperience: {
        company: string;
        position: string;
        duration: string;
        responsibilities: string[];
        achievements?: string[];
    }[];
    skills: {
        technical: string[];
        soft: string[];
    };
    projects?: {
        name: string;
        description: string;
        technologies: string[];
        link?: string;
    }[];
    certifications?: {
        name: string;
        issuer: string;
        year: string;
    }[];
    languages?: {
        name: string;
        proficiency: string;
    }[];
}

export type ResumeSection = keyof Resume;

export interface ConversationState {
    currentSection: ResumeSection;
    isComplete: boolean;
    lastQuestion: string;
    context: string;
}

export interface Question {
    section: ResumeSection;
    question: string;
    expectedAnswerType: 'text' | 'list' | 'date' | 'email' | 'phone' | 'url';
    followUpQuestions?: string[];
} 