import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const header = screen.queryByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstNameInput, "boo");

    const firstInputError = await screen.queryByText("Error: firstName must have at least 5 characters.");
    expect(firstInputError).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const allErrors = await screen.findAllByTestId("error");
    expect(allErrors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstNameInput, "Kennedy");
    const lastNameInput = screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastNameInput, "Bryant");
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "");
    
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const emailInputError = await screen.queryByText("Error: email must be a valid email address.");
    expect(emailInputError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, 'hello');

    const emailError = screen.queryByText("Error: email must be a valid email address.");
    expect(emailError).toBeInTheDocument();    
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstNameInput, "Kennedy");
    const lastNameInput = screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastNameInput, "");
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "test@email.com");
    
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const lastInputError = await screen.queryByText("Error: lastName is a required field.");
    expect(lastInputError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstNameInput, "Kennedy");
    const lastNameInput = screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastNameInput, "Bryant");
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "test@email.com");
   

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstInputDisplay = screen.queryByText("Kennedy");
        expect(firstInputDisplay).toBeInTheDocument();

        const lastInputDisplay = screen.queryByText("Bryant");
        expect(lastInputDisplay).toBeInTheDocument();

        const emailInputDisplay = screen.queryByText("test@email.com");
        expect(emailInputDisplay).toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstNameInput, "Kennedy");
    const lastNameInput = screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastNameInput, "Bryant");
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "test@email.com");
    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(messageInput, "Hello World");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstInputDisplay = screen.queryByText("Kennedy");
        expect(firstInputDisplay).toBeInTheDocument();

        const lastInputDisplay = screen.queryByText("Bryant");
        expect(lastInputDisplay).toBeInTheDocument();

        const emailInputDisplay = screen.queryByText("test@email.com");
        expect(emailInputDisplay).toBeInTheDocument();

        const messageInputDisplay = screen.queryAllByText("Hello World");
        expect(messageInputDisplay[1]).toBeInTheDocument();
    });
});