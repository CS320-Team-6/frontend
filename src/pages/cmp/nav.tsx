import { Button } from '@mui/material';
import { useState } from 'react';

export default function Nav(props: { onValueChange: (arg0: boolean) => boolean; }) {
   const [isStaff, setIsStaff] = useState(true);
   const handleStaffChange = () => {
      setIsStaff(!isStaff);
      props.onValueChange(isStaff);
   };
   return (
      <>
         <Button
         size="large"
         variant="contained"
         onClick={() => setIsStaff(false)}
         >
            Staff Login
         </Button>
      </>
   );
}
