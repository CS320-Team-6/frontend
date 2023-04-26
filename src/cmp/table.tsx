import React, { useState, Fragment } from 'react';
import {
  Button, MenuItem, TextField,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import priorities from './priorities.json';
import statuses from './statuses.json';

interface MyDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface Issue {
  id: number;
  equipmentId: number;
  status: string;
  dateReported: MyDate;
  priority: string;
  description: string | null;
  assignedTo: string | null;
  dateResolved: string | null;
  resolutionDetails: string | null;
  notes: string | null;
}

interface TableProps {
  issues: Issue[];
  URL: string;
  getData: () => void;
}

export default function MyTable(props: TableProps) {
  const { issues, URL, getData } = props;
  const [editId, setEditId] = useState('');
  const [id, setId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [status, setStatus] = useState('NEW'); // NEW, IN_PROGRESS, RESOLVED
  // const [date, setDate] = useState(new MyDate(null));
  const [priority, setPriority] = useState('LOW'); // LOW, MEDIUM, HIGH, URGENT
  // const [assignedTo, setAssignedTo] = useState(''); // Staff member
  // const [dateResolved, setDateResolved] = useState(new Date());
  // const [resolutionDetails, setResolutionDetails] = useState('');
  // const [notes, setNotes] = useState('');

  const handleEditClick = (issue: Issue) => {
    setEditId(String(issue.id));
    setId(String(issue.id));
    setEquipmentId(String(issue.equipmentId));
    setStatus(issue.status);
    // setDate(issue.dateReported);
    setPriority(issue.priority);
    // setAssignedTo(issue.assignedTo);
  };

  const handleEditSave = async (issue: Issue) => {
    setEditId('');
    const resFetch = await fetch(`${URL}/${issue.id}`);
    const resFetchJSON = await resFetch.json();
    resFetchJSON.status = status;
    resFetchJSON.priority = priority;
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resFetchJSON),
    };
    const resPost = await fetch(`${URL}/${issue.id}`, requestOptions);
    getData();
    console.log(resPost.ok);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };
  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(event.target.value);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ticket ID</TableCell>
          <TableCell>Equipment ID</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date Reported</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Assigned To</TableCell>
          <TableCell>Date Resolved</TableCell>
          <TableCell>Resolution Details</TableCell>
          <TableCell>Notes</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {issues && issues.map((row: Issue) => (
          <>
            { editId !== String(row.id)
                && (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.equipmentId}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{`${row.dateReported.month}/${row.dateReported.day}/${row.dateReported.year}`}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.assignedTo}</TableCell>
                  <TableCell>{row.dateResolved}</TableCell>
                  <TableCell>{row.resolutionDetails}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell><Button onClick={() => handleEditClick(row)}>Edit</Button></TableCell>
                  <TableCell><Button disabled>Cancel</Button></TableCell>
                </TableRow>
                )}
            {
              editId === String(row.id)
                && (
                <TableRow>
                  <TableCell><TextField disabled value={id} /></TableCell>
                  <TableCell><TextField disabled value={equipmentId} /></TableCell>
                  <TableCell>
                    <TextField select value={status} onChange={handleStatusChange}>
                      {statuses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell><TextField disabled value={`${row.dateReported.month}/${row.dateReported.day}/${row.dateReported.year}`} /></TableCell>
                  <TableCell>
                    <TextField select value={priority} onChange={handlePriorityChange}>
                      {priorities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell><TextField disabled value={row.description} /></TableCell>
                  <TableCell><TextField disabled value={row.assignedTo} /></TableCell>
                  <TableCell><TextField disabled value={row.dateResolved} /></TableCell>
                  <TableCell><TextField disabled value={row.resolutionDetails} /></TableCell>
                  <TableCell><TextField disabled value={row.notes} /></TableCell>
                  <TableCell><Button variant="outlined" onClick={() => handleEditSave(row)}>Save</Button></TableCell>
                  <TableCell><Button onClick={() => setEditId('')}>Cancel</Button></TableCell>
                </TableRow>
                )
              }
          </>
        ))}
      </TableBody>
    </Table>
  );
}
