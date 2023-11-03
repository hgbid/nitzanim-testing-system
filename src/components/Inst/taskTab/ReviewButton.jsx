import React from 'react';
import { Button } from '@nextui-org/react';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function ReviewButton({ selectedVersion, name }) {
  
    return (
    <>
      {selectedVersion.review ? (
        <CheckCircleRoundedIcon sx={{ color: '#005395' }} />
      ) : (
        <Button
          radius="full"
          isIconOnly
          variant="faded"
          onClick={() => {
            const versionToCheck = {
              ...selectedVersion,
              name,
            };
            localStorage.setItem('versionToCheck', JSON.stringify(versionToCheck));

            window.open('/review', '_blank');
          }}
        >
          <CreateRoundedIcon />
        </Button>
      )}
    </>
  );
}