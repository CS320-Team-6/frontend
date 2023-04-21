import React, { useState, Fragment } from 'react';
import {
  Button, MenuItem, TextField,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import priorities from './priorities.json';
import statusies from './statusies.json';

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

  const [sortID, setSortID] = useState('');
  const [sortEquipmentID, setSortEquipmentID] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [sortDateReported, setSortDateReported] = useState('');
  const [sortPriority, setSortPriority] = useState('');
  const [sortDateResolved, setSortDateResolved] = useState('');

  const handleSortIDChange = () => {
    resetSort();
    if (sortID === '') {
      setSortID('↑');
      issues.sort((a, b) => a.id - b.id);
    } else if (sortID === '↑') {
      setSortID('↓');
      issues.sort((a, b) => b.id - a.id);
    } else {
      setSortID('');
      issues.sort((a, b) => a.id - b.id);
    }
  }
    const handleSortEquipmentIDChange = () => {
      resetSort();
      if (sortEquipmentID === '') {
        setSortEquipmentID('↑');
        issues.sort((a, b) => a.equipmentId - b.equipmentId);
      } else if (sortEquipmentID === '↑') {
        setSortEquipmentID('↓');
        issues.sort((a, b) => b.equipmentId - a.equipmentId);
      } else {
        setSortEquipmentID('');
        issues.sort((a, b) => a.id - b.id);
      }
    }
    const handleSortStatusChange = () => {
      resetSort();
      // possible values for status are: NEW, IN_PROGRESS, RESOLVED, CLOSED
      // when sorting, we want to sort by the order of the above list
      const order = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

        if (sortStatus === '') {
          setSortStatus('↑');
          issues.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
        }
        else if (sortStatus === '↑') {
          setSortStatus('↓');
          issues.sort((a, b) => order.indexOf(b.status) - order.indexOf(a.status));
        }
        else {
          setSortStatus('');
          issues.sort((a, b) => a.id - b.id);
        }
    }
    // methods to compare two dates of type MyDate
    const compareDates = (a: MyDate, b: MyDate) => {
      if (a.year === b.year) {
        if (a.month === b.month) {
          if (a.day === b.day) {
              return 0;
          }
          return a.day - b.day;
        }
        return a.month - b.month;
      }
      return a.year - b.year;
    }
    const handleSortDateReportedChange = () => {
      resetSort();
      // sort dates by chronological order
      if (sortDateReported === '') {
        setSortDateReported('↑');
        issues.sort((a, b) => compareDates(b.dateReported, a.dateReported));
      }
      else if (sortDateReported === '↑') {
        setSortDateReported('↓');
        issues.sort((a, b) => compareDates(a.dateReported, b.dateReported));
      }
      else {
        setSortDateReported('');
        issues.sort((a, b) => a.id - b.id);
      }
    }
    const handleSortPriorityChange = () => {
      resetSort();
      // possible values for priority are: HIGH, MEDIUM, LOW
      // when sorting, we want to sort by the order of the above list
      const order = ['HIGH', 'MEDIUM', 'LOW'];

      if (sortPriority === '') {
        setSortPriority('↑');
        issues.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));
      }
      else if (sortPriority === '↑') {
        setSortPriority('↓');
        issues.sort((a, b) => order.indexOf(b.priority) - order.indexOf(a.priority));
      }
      else {
        setSortPriority('');
        issues.sort((a, b) => a.id - b.id);
      }
    }
    const resetSort = () => {
      setSortID('');
      setSortEquipmentID('');
      setSortStatus('');
      setSortDateReported('');
      setSortPriority('');
      setSortDateResolved('');
    }



  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Button onClick={handleSortIDChange}>Ticket ID {sortID}</Button>
          </TableCell>
          <TableCell>
            <Button onClick={handleSortEquipmentIDChange}>Equipment ID {sortEquipmentID}</Button>
          </TableCell>
          <TableCell>
            <Button onClick={handleSortStatusChange}>Status {sortStatus}</Button>
          </TableCell>
          <TableCell>
            <Button onClick={handleSortDateReportedChange}>Date Reported {sortDateReported}</Button>
          </TableCell>
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
                      {statusies.map((option) => (
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
