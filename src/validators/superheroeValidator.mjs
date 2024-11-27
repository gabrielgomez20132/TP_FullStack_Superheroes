import { body } from 'express-validator';

export const validarSuperheroe = [
    body('nombreSuperHeroe')
        .trim()
        .notEmpty().withMessage('El nombre del superhéroe es requerido')
        .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres')
        .isLength({ max: 60 }).withMessage('No puede superar los 60 caracteres'),

    body('nombreReal')
        .trim()
        .notEmpty().withMessage('El nombre real es requerido')
        .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres')
        .isLength({ max: 60 }).withMessage('No puede superar los 60 caracteres'),

    body('edad')
        .notEmpty().withMessage('La edad es requerida')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero no negativo'),

    body('poderes')
        .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un poder')
        .custom((poderes) => {
            if (!poderes.every(poder => typeof poder === 'string' && poder.trim().length >= 3 && poder.trim().length <= 60)) {
                throw new Error('Cada poder debe tener entre 3 y 60 caracteres');
            }
            return true;
        }),
];