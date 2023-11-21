
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { ListarUsuarios,
    ActualizarUsuario,
    CrearUsuario,
    EliminarUsuario,
    usuariosPatch } = require('../controllers/usuarios');

const router = Router();

// Listar Usuarios
router.get('/', ListarUsuarios);

// Crear Usuario
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], CrearUsuario);

// ActualizarUsuario
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], ActualizarUsuario);

// TODO:
router.patch('/', usuariosPatch);

// Eliminar Usuario
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], EliminarUsuario);



module.exports = router;