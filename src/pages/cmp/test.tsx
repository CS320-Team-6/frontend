import { Table, TableHead, TableRow, TableCell,TableBody } from "@mui/material";

const data = [
   {"id":1,"equipmentId":1,"status":"NEW","dateReported":{"year":2023,"month":3,"day":5,"hour":2,"minute":15},"priority":"LOW","description":null,"assignedTo":"jwordell@umass.edu","dateResolved":null,"resolutionDetails":null,"notes":null},
   {"id":2,"equipmentId":1,"status":"NEW","dateReported":{"year":2023,"month":3,"day":5,"hour":2,"minute":15},"priority":"LOW","description":null,"assignedTo":null,"dateResolved":null,"resolutionDetails":null,"notes":null},
   {"id":3,"equipmentId":1,"status":"NEW","dateReported":{"year":2023,"month":4,"day":6,"hour":13,"minute":12},"priority":"MEDIUM","description":null,"assignedTo":null,"dateResolved":null,"resolutionDetails":null,"notes":null},
   {"id":4,"equipmentId":1,"status":"NEW","dateReported":{"year":2023,"month":4,"day":6,"hour":13,"minute":34},"priority":"URGENT","description":null,"assignedTo":null,"dateResolved":null,"resolutionDetails":null,"notes":null},
   {"id":5,"equipmentId":1,"status":"NEW","dateReported":{"year":2023,"month":4,"day":6,"hour":15,"minute":3},"priority":"HIGH","description":null,"assignedTo":null,"dateResolved":null,"resolutionDetails":null,"notes":null}
 ];
 
 function MyTable() {
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
         {data.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>{row.equipmentId}</TableCell>
             <TableCell>{row.status}</TableCell>
             <TableCell>{`${row.dateReported.month}/${row.dateReported.day}/${row.dateReported.year} ${row.dateReported.hour}:${row.dateReported.minute}`}</TableCell>
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
 
 export default MyTable;