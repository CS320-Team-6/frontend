import React, { useEffect, useState } from 'react';

import {
  TextField, MenuItem, Box, Button, Alert,
} from '@mui/material';
import '../styles/App.css';
import priorities from './priorities.json';
import problems from './problems.json';

export default function Form() {
  const [Id, setId] = useState('');
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState('LOW'); // LOW, MEDIUM, HIGH, URGENT
  const [problem, setProblem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successfulSub, setSuccessfulSub] = useState(false);
  const [hasRes, setHasRes] = useState(false);
  const [btnTxt, setBtnTxt] = useState('Submit');
  const URL = 'https://urepair.me/issue';
  const postData = async () => {
    setSubmitted(true);
    setBtnTxt('Loading...');
    setDate(new Date());
    const ticket = {
      id: 1,
      equipmentId: Id,
      status: 'NEW',
      dateReported: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // add 1 because getMonth() returns 0-based index
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
      priority,
      description: problem,
      assignedTo: null,
      dateResolved: null,
      resolutionDetails: null,
      notes: null,
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    };
    await fetch(URL, requestOptions)
      .then((response) => setSuccessfulSub(response.ok));
    // .catch((error) => console.log(error));
    setHasRes(true);
    setBtnTxt('Submit Another Ticket');
    // clear id and stop fetching from URL params
    setId('');
    document.getElementById('standard-basic')?.removeAttribute('disabled');
    document.getElementById('standard-basic')?.removeAttribute('style');
  };

  const newTicket = () => {
    setSubmitted(false);
    setSuccessfulSub(false);
    setHasRes(false);
    setBtnTxt('Submit');
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };
  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(event.target.value);
  };
  const handleProblemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProblem(event.target.value);
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setId(id as string);
      // disable the id field
      document.getElementById('standard-basic')?.setAttribute('disabled', 'true');
      // gray out the id field
      document.getElementById('standard-basic')?.setAttribute('style', 'background-color: #e0e0e0');
    }
  }, []);

  return (
    <>
      <h1 className="title">
        Welcome to URepair!
      </h1>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="Equipment-Id"
          value={Id}
          onChange={handleIdChange}
        />
        <TextField
          id="outlined-select-priority"
          select
          label="Priority"
          defaultValue="LOW"
          onChange={handlePriorityChange}
        >
          {priorities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-problem"
          select
          label="Whats wrong?"
          defaultValue="Select an option."
          onChange={handleProblemChange}
        >
          {problems.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button
        variant="contained"
        onClick={!submitted ? postData : newTicket}
        size="large"
      >
        {btnTxt}
      </Button>
      {
        hasRes && (
          <Alert
            severity={successfulSub ? 'success' : 'error'}
          >
            {successfulSub ? 'Ticket Submitted' : 'Ticket Submission Failed'}
          </Alert>
        )
      }
    </>
  );
}
