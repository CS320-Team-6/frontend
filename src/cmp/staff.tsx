// import styles from '@/styles/Home.module.css';
import React, { useState } from 'react';
import { Button } from '@mui/material';
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
  description: string;
  assignedTo: string | null;
  dateResolved: string | null;
  resolutionDetails: string | null;
  notes: string | null;
}

interface Equipment {
  id: number,
  name: string,
  equipmentType: string,
  manufacturer: string,
  model: string,
  serialNumber: string,
  location: string,
  dateInstalled: {
    year: number,
    month: number,
    day: number
  },
  lastMaintenanceDate: {
    year: number,
    month: number,
    day: number
  }
}

export default function Staff() {
  const [data, setData] = useState(new Array<Issue>());
  const [equipment, setEquipment] = useState(new Array<Equipment>());
  const [hasData, setHasData] = useState(false);
  const [hasEquipment, setHasEquipment] = useState(false);
  const ISSUE_URL = 'https://urepair.me/issue';
  const EQUIPMENT_URL = 'https://urepair.me/equipment';

  const getData = async () => {
    const res = await fetch(ISSUE_URL);
    const resJSON = await res.json();
    resJSON.issue_table.sort((a: Issue, b: Issue) => a.id - b.id);
    setData(resJSON.issue_table);
    setHasData(true);
  };

  const getEquipment = async () => {
    const res = await fetch(EQUIPMENT_URL);
    const resJSON = await res.json();
    resJSON.equipment_table.sort((a: Equipment, b: Equipment) => a.id - b.id);
    setEquipment(resJSON.equipment_table);
    setHasEquipment(true);
  };

  return (
    <>
      {/*
      <h1 className={styles.title}>
        Staff
      </h1> */
      }
      {
        !hasData && (
          <Button
            size="large"
            variant="contained"
            onClick={getData}
          >
            Fetch Tickets
          </Button>
        )
      }
      {
        !hasEquipment && (
          <Button
            size="large"
            variant="contained"
            onClick={getEquipment}
          >
            Fetch Equipment
          </Button>
        )
      }
      {hasData && <EnhancedTable URL={ISSUE_URL} issues={data} getData={getData} />}
      {hasEquipment && JSON.stringify(equipment)}
    </>
  );
}
