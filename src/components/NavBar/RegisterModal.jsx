import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Modal, ModalHeader, ModalContent } from '@nextui-org/react';
import { Input, Select, Divider, SelectItem } from '@nextui-org/react';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import GoogleIcon from '@mui/icons-material/Google';
import registerUserInDB from '../../requests/registerUser';

const groups = {
  דרום: ['אשקלון', 'קרית גת', 'באר שבע'],
  מרכז: ['תל אביב', 'לוד', 'פתח תקווה'],
};

const RegisterModal = ({ app, auth, open, setOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [group, setGroup] = useState('');
  const [choosenRegion, setChoosenRegion] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleEmailSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, { displayName: name }).then(() => {
          console.log(userCredential.user);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = {
          name: name,
          lastName: lastName,
          email: result.user.email,
          region: choosenRegion,
          group: group,
        };
        registerUserInDB({ user, uid: result.user.uid, app });
        setOpen(false);
        console.log(result.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <Modal isOpen={open} dir="rtl">
        <ModalContent onClose={() => setOpen(false)}>
          <ModalHeader> הרשמה</ModalHeader>

          <ModalBody>
            <Input label="שם" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />

            <Select
              label="אזור"
              value={choosenRegion}
              onChange={(e) => {
                setChoosenRegion(e.target.value);
                setGroup('');
              }}
              dir="rtl"
            >
              {Object.keys(groups).map((region) => (
                <SelectItem key={region} value={region} dir="rtl">
                  {region}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="קבוצה"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              dir="rtl"
              disabled={!choosenRegion}
            >
              {choosenRegion &&
                groups[choosenRegion].map((group) => (
                  <SelectItem key={group} value={group} dir="rtl">
                    {group}
                  </SelectItem>
                ))}
            </Select>

            <Divider />

            {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}
            <Button
              onClick={handleGoogleSignIn}
              startContent={<GoogleIcon />}
              isDisabled={!name || !lastName || !group}
            >
              הרשמה באמצעות גוגל
            </Button>
            {/*<Divider orientation="vertical"> או </Divider>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Input label="מייל" value={email} onChange={(e) => setName(e.target.value)} />
                <Input label="ססמה" value={password} onChange={(e) => setLastName(e.target.value)} />
 */}
            <Button
              onClick={handleEmailSignUp}
              startContent={<EmailRoundedIcon />}
              isDisabled={!name || !lastName || !group}
            >
              הרשמה באמצעות מייל וססמה
            </Button>
            {/* </div>
            </div> */}
          </ModalBody>

          <ModalFooter>
            <button onClick={() => setOpen(false)}>סגור</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterModal;