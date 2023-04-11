import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';

interface Issue {
  id: number;
  equipmentId: number;
  status: string;
  dateReported: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  priority: string;
  description: string | null;
  assignedTo: string | null;
  dateResolved: string | null;
  resolutionDetails: string | null;
  notes: string | null;
}

interface TableProps {
  issues: Issue[];
}

export default function MyTable(props: TableProps) {
  const { issues } = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Equipment ID</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date Reported</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Assigned To</TableCell>
          <TableCell>Date Resolved</TableCell>
          <TableCell>Resolution Details</TableCell>
          <TableCell>Notes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {issues && issues.map((row: Issue) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
