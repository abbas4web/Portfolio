import React, { useRef, useState } from 'react';
import '../assets/styles/Contact.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

function Contact() {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameEmpty = name.trim() === '';
    const isEmailEmpty = email.trim() === '';
    const isMessageEmpty = message.trim() === '';

    setNameError(isNameEmpty);
    setEmailError(isEmailEmpty);
    setMessageError(isMessageEmpty);

    if (!isNameEmpty && !isEmailEmpty && !isMessageEmpty) {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nContact: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:abbas4developer@gmail.com?subject=${subject}&body=${body}`;
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div id="contact">
      <div className="items-container">
        <div className="contact_wrapper">
          <h1>Contact Me</h1>
          <p>Interested in collaborating on AI projects or full-stack engineering? Let's connect!</p>
          <Box
            ref={form}
            component="form"
            noValidate
            autoComplete="off"
            className='contact-form'
            onSubmit={sendEmail}
          >
            <div className='form-flex'>
              <TextField
                required
                id="contact-name"
                label="Your Name"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(false);
                }}
                error={nameError}
                helperText={nameError ? "Please enter your name" : ""}
              />
              <TextField
                required
                id="contact-email"
                label="Email / Phone"
                placeholder="How can I reach you?"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
                error={emailError}
                helperText={emailError ? "Please enter your email or phone number" : ""}
              />
            </div>
            <TextField
              required
              id="contact-message"
              label="Message"
              placeholder="Send me any inquiries or project details"
              multiline
              rows={10}
              className="body-form"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (messageError) setMessageError(false);
              }}
              error={messageError}
              helperText={messageError ? "Please enter the message" : ""}
            />
            <Button type="submit" variant="contained" endIcon={<SendIcon />} onClick={sendEmail}>
              Send Message
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;