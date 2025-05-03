import React from 'react';
import { dummyTestimonial, assets } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-medium text-gray-800 text-center">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3 text-center max-w-3xl mx-auto">
        Hear from our learners as they share their journeys of transformation, success and how our
        <br />
        platform has made a difference in their lives.
      </p>

      <div className="mt-14 flex flex-wrap justify-center gap-8">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="w-full sm:w-[300px] md:w-[280px] text-sm border border-gray-200 pb-6 bg-white rounded-lg shadow-md overflow-hidden hover:scale-[1.03] transition-transform duration-300"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-100">
              <img className="h-12 w-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className="text-lg font-medium text-gray-800">{testimonial.name}</h1>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="h-5"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className='text-blue-500 underline px-5'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
