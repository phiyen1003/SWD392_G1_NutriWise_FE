import { Snackbar, Alert } from "@mui/material"

const Toast = ({statusCode, information, open, onClose}: 
    {statusCode: number, information: string, open: boolean | undefined, onClose: () => void}) => {
    return (
        <Snackbar 
        open={open} 
        onClose={onClose}
        autoHideDuration={2000} 
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        className="w-full">
            <Alert
                severity={statusCode === 200 ? "success" : "error"}
                variant="standard"
                sx={{ width: '100%' }}
            >
                {information}
            </Alert>
        </Snackbar>
    )
}

export default Toast