import React from 'react';
import { useAppStore } from './AppStore';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const GlobalUI: React.FC = () => {
  const [state, dispatch] = useAppStore();

  return (
    <>
      {state.globalAlert && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => dispatch({ type: 'CLEAR_ALERT' })}
        >
          <Alert
            severity={state.globalAlert.type}
            onClose={() => dispatch({ type: 'CLEAR_ALERT' })}
            variant="filled"
          >
            {state.globalAlert.message}
          </Alert>
        </Snackbar>
      )}

      {state.globalModal && (
        <Dialog open onClose={() => dispatch({ type: 'CLOSE_MODAL' })}>
          <DialogTitle>{state.globalModal.title}</DialogTitle>
          <DialogContent dividers>{state.globalModal.content}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                dispatch({ type: 'CLOSE_MODAL' });
                state.globalModal?.onClose?.();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
    </>
  );
};

export default GlobalUI;
