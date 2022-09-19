import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { removeSnackbar } from '../actions/snackBar';
import CloseIcon from '@material-ui/icons/Close';
import { closeSnackbar as closeSnackbarAction } from '../actions/snackBar';
import { Button, IconButton } from '@material-ui/core';

let displayed = [];

const useNotifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(store => store.snackbar.notifications || []);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    React.useEffect(() => {
        notifications.forEach(({ key, message, variant, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                variant,
                action: key => (
                    // <IconButton onClick={() => dispatch(closeSnackbarAction(key))}>
                    //     <CloseIcon />
                    // </IconButton>
                    <Button onClick={() => dispatch(closeSnackbarAction(key))}>Close</Button>
                ),
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(removeSnackbar(myKey));
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
