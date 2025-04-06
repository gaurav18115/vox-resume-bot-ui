// components/Testimonials.tsx

const testimonials = [
    {
        name: "Rahul Sharma",
        role: "Software Engineer",
        content: "MeraResumeBanao helped me create a professional resume that landed me multiple interviews!"
    },
    {
        name: "Priya Patel",
        role: "Marketing Manager",
        content: "The AI suggestions were incredibly helpful in highlighting my achievements effectively."
    }
];

export default function Testimonials() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.content}</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 font-bold">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}