import { Modal, Box, TextField, Button } from "@mui/material";
import { createAllergen, getAllergenById, updateAllergen } from "../../api/allergenApi";
import { useEffect, useState } from "react";
import { AllergenDTO } from "../../types/types";

const AllergenModal = ({ open, allergen, handleClose, setAllergens, title, action }: {
    open: boolean, allergen: AllergenDTO,
    handleClose: () => void, setAllergens: React.Dispatch<React.SetStateAction<AllergenDTO[]>>,
    title: string, action: string
}) => {
    const [formData, setFormData] = useState<AllergenDTO | null>({
        allergenId: 0,
        name: "",
        description: "",
    });

    useEffect(() => {
        if (allergen) {
            setFormData(allergen);
        }
    }, [allergen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        console.log(formData);
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData) return;

        try {
            let response: AllergenDTO | null = null;

            if (action === "update") {
                if (!formData.allergenId) {
                    throw new Error("Missing allergenId for update");
                }
                response = await updateAllergen(formData.allergenId, formData);
            } else if (action === "create") {
                response = await createAllergen(formData);
            }

            if (response) {
                setAllergens((prev) =>
                    action === "update"
                        ? prev.map((a) => (a.allergenId === formData.allergenId ? response : a))
                        : [...prev, response]
                );
                handleClose();
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // Centers the modal
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 3, // Padding inside the modal
                        minWidth: 400, // Ensures the modal is wide enough for the form
                        maxWidth: 600, // Prevents it from being too large
                        borderRadius: 2, // Adds rounded corners
                    }}
                >
                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tên thành phần"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            value={formData?.description}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                        />
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button variant="outlined" onClick={handleClose}>Hủy</Button>
                            <Button type="submit" variant="contained" color="primary">Lưu</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default AllergenModal;
