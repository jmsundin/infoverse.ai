"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function ContactForm() {
  const openDialogRef = useRef(null);
  const dialogRef = useRef(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [progress, setProgress] = useState(10);
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    let progress = 0;
    setInterval(() => {
      progress += 20;
      const timer = setTimeout(() => setProgress(progress), 500);
      if (progress === 100) {
        clearTimeout(timer);
      }
    }, 200);
  }, [sendingEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSendingEmail(true);
    openDialogRef.current.click();

    async function sendEmail() {
      const res = await fetch("/api/sendgrid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const { status, message } = await res.json();
      if (status === "OK") {
        setSendingEmail(false);
        setMessage(`Thank you for reaching out, ${formState.name}!`);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setMessage(message);
      }
    }

    sendEmail();
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-4 p-4 max-w-[700px] mx-auto">
        <Card className="flex flex-col gap-4 p-4">
          <h1 className="flex justify-center text-2xl font-semibold text-black">
            Contact Me
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  placeholder="john_doe@gmail.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="phone">Subject</Label>
                <Input
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formState.subject}
                  onChange={handleFormChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <Label htmlFor="message">Message</Label>
              <div className="flex flex-col">
                <Textarea
                  label="Message"
                  name="message"
                  value={formState.message}
                  onChange={handleFormChange}
                  placeholder="Your message here..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-36 rounded-lg bg-indigo-500 text-white text-lg hover:bg-indigo-400"
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden" ref={openDialogRef} />
        </DialogTrigger>
        <DialogContent className="w-5/6 sm:max-w-[425px]">
          <div ref={dialogRef}>
            <DialogHeader>
              <DialogTitle>
                {sendingEmail && (
                  <Fragment>
                    <Progress value={progress} className="m-4 w-full" />
                    <p className="text-center m-2">
                      Please wait while we send your email...
                    </p>
                  </Fragment>
                )}
                {!sendingEmail && (
                  <p className="text-center m-2">Email sent successfully!</p>
                )}
              </DialogTitle>
              <DialogDescription>
                {!sendingEmail && (
                  <p className="text-center text-base">{message}</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ContactForm;
