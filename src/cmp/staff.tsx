// import styles from '@/styles/Home.module.css';
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import EnhancedTable from './table';

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

interface Equipment {
  id: number;
  name: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  dateInstalled: {
    year: number;
    month: number;
    day: number;
  };
  lastMaintenanceDate: {
    year: number;
    month: number;
    day: number;
  };
}

export default function Staff() {
  const [issues, setIssues] = useState(new Array<Issue>());
  const [hasIssues, setHasIssues] = useState(false);
  const [equipment, setEquipment] = useState(new Array<Equipment>());
  const [hasEquipment, setHasEquipment] = useState(false);
  const [activeTable, setActiveTable] = useState('none'); // ['issues', 'equipment']
  const URL = 'http://urepair.me/';

  const getIssues = async () => {
    setActiveTable('issues');
    if (hasIssues) {
      console.log(issues);
      return;
    }
    const res = await fetch(`${URL}issue`);
    const resJSON = await res.json();
    resJSON.issue_table.sort((a: Issue, b: Issue) => a.id - b.id);
    setIssues(resJSON.issue_table);
    setHasIssues(true);
    console.log(issues);
  };
  const getEquipment = async () => {
    setActiveTable('equipment');
    if (hasEquipment) {
      console.log(equipment);
      return;
    }
    const res = await fetch(`${URL}equipment`);
    const resJSON = await res.json();
    resJSON.equipment_table.sort((a: Equipment, b: Equipment) => a.id - b.id);
    setEquipment(resJSON.equipment_table);
    setHasEquipment(true);
    console.log(equipment);
  };

  return (
    <>
      <Box sx={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Button
          size="large"
          variant={activeTable === 'issues' ? 'outlined' : 'contained'}
          onClick={getIssues}
        >
          Tickets
        </Button>
        <Button
          size="large"
          variant={activeTable === 'equipment' ? 'outlined' : 'contained'}
          onClick={getEquipment}
        >
          Equipment
        </Button>
      </Box>
      {activeTable === 'issues' && <EnhancedTable issues={issues} /* type="issues" */ />}
      {/* hasIssues && <EnhancedTable URL={URL} issues={equipment} getData={getEquipment} /> */}
    </>
  );
}
