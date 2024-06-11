import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    emailjs
      .sendForm(
        "service_5e4ilpv"!,
        "template_npfow73"!,
        e.target as HTMLFormElement,
        "xuHq5kmBF5sAwFE_u"!
      )
      .then(
        (result) => {
          setStateMessage('Message sent!');
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000); // hide message after 5 seconds
        },
        (error) => {
          setStateMessage('Something went wrong, please try again later');
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000); // hide message after 5 seconds
        }
      );
  
    // Clears the form after sending the email
    (e.target as HTMLFormElement).reset();
  };
  

  return (
    <form onSubmit={sendEmail}>
                  <div className="input-group">
                    <input type="text" name="user_name" className="input" />
                    <label className="label">Fullname</label>
                  </div>
                  <div className="input-group">
                    <input type="email" name="user_email" className="input" />
                    <label className="label">Email</label>
                  </div>
                  <div className="input-group">
                    <input type="text" name="reason" className="input" />
                    <label className="label">Reason</label>
                  </div>
                  <div className="input-group">
                    <input type="textbox" name="message" className="input" />
                    <label className="label">Message</label>
                  </div>
                  <button type="submit" className="btn" disabled={isSubmitting}>SEND</button>
                  {stateMessage && <p>{stateMessage}</p>}
                </form>
  );
};

export default ContactForm;
