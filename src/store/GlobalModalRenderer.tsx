import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useAppStore } from './AppStore';

const GlobalModalRenderer = () => {
    const [state, dispatch] = useAppStore();
    const modal = state.globalModal;
    
    const handleClose = () => {
        modal?.onClose?.();
        dispatch({ type: 'CLOSE_MODAL' });
    };

    return (
        <Dialog open={!!modal} onClose={handleClose}>
            <DialogTitle>{modal?.title}</DialogTitle>
            <DialogContent>{modal?.content}</DialogContent>
            <DialogActions>
                {modal?.onClose && (
                    <Button onClick={modal.onClose} color="secondary">
                        {'Cancel'}
                    </Button>
                )}
                {modal?.onClose && (
                    <Button onClick={modal.onClose} color="primary">
                        {'Confirm'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
