import { createContext, useContext, useState, useCallback } from 'react';
import { Resume, ConversationState, ResumeSection } from '@/types/resume';
import { resumeQuestions, sectionOrder } from '@/utils/resumeQuestions';

type ResumeData =
    | Resume['basicDetails']
    | Resume['education'][number]
    | Resume['workExperience'][number]
    | Resume['skills']
    | NonNullable<Resume['projects']>[number]
    | NonNullable<Resume['certifications']>[number]
    | NonNullable<Resume['languages']>[number];

interface ResumeContextType {
    resume: Resume;
    conversationState: ConversationState;
    currentQuestion: string;
    updateResume: (section: ResumeSection, data: ResumeData) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    resetConversation: () => void;
}

const initialResume: Resume = {
    basicDetails: {
        name: '',
        email: '',
        phone: '',
        location: '',
    },
    education: [],
    workExperience: [],
    skills: {
        technical: [],
        soft: []
    },
    projects: [],
    certifications: [],
    languages: []
};

const initialConversationState: ConversationState = {
    currentSection: 'basicDetails',
    isComplete: false,
    lastQuestion: '',
    context: ''
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const [resume, setResume] = useState<Resume>(initialResume);
    const [conversationState, setConversationState] = useState<ConversationState>(initialConversationState);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const updateResume = useCallback((section: ResumeSection, data: ResumeData) => {
        setResume(prev => {
            const currentValue = prev[section];
            if (Array.isArray(currentValue)) {
                return {
                    ...prev,
                    [section]: [...currentValue, data]
                };
            } else if (typeof currentValue === 'object' && currentValue !== null) {
                return {
                    ...prev,
                    [section]: { ...currentValue, ...data }
                };
            } else {
                return {
                    ...prev,
                    [section]: data
                };
            }
        });
    }, []);

    const nextQuestion = useCallback(() => {
        const currentSection = conversationState.currentSection;
        const questions = resumeQuestions[currentSection];

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const currentSectionIndex = sectionOrder.indexOf(currentSection);
            if (currentSectionIndex < sectionOrder.length - 1) {
                const nextSection = sectionOrder[currentSectionIndex + 1];
                setConversationState(prev => ({
                    ...prev,
                    currentSection: nextSection
                }));
                setCurrentQuestionIndex(0);
            } else {
                setConversationState(prev => ({
                    ...prev,
                    isComplete: true
                }));
            }
        }
    }, [conversationState.currentSection, currentQuestionIndex]);

    const previousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            const currentSectionIndex = sectionOrder.indexOf(conversationState.currentSection);
            if (currentSectionIndex > 0) {
                const prevSection = sectionOrder[currentSectionIndex - 1];
                setConversationState(prev => ({
                    ...prev,
                    currentSection: prevSection
                }));
                setCurrentQuestionIndex(resumeQuestions[prevSection].length - 1);
            }
        }
    }, [conversationState.currentSection, currentQuestionIndex]);

    const resetConversation = useCallback(() => {
        setResume(initialResume);
        setConversationState(initialConversationState);
        setCurrentQuestionIndex(0);
    }, []);

    const currentQuestion = resumeQuestions[conversationState.currentSection][currentQuestionIndex].question;

    return (
        <ResumeContext.Provider value={{
            resume,
            conversationState,
            currentQuestion,
            updateResume,
            nextQuestion,
            previousQuestion,
            resetConversation
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
} 