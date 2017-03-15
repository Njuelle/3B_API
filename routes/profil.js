var express          = require('express');
var router           = express.Router();
var authentification = require('../middlewares/authentification');
var profilController   = require('../controllers/profilController');

router.use(authentification.authentification);

router.route('').get(profilController.getProfil);
router.route('/user/me').get(profilController.getProfilCurrentUser);
router.route('/user/:uid').get(profilController.getProfilByUser);
router.route('/:uid').get(profilController.getProfilById);
router.route('').post(profilController.postProfil);
router.route('/:uid').put(profilController.putProfil);
router.route('/:uid').delete(profilController.deleteProfil);
router.route('/:uid/route').post(profilController.postRoute);
router.route('/:uid/route/:rowId').get(profilController.getRoute);
router.route('/:uid/route/:rowId').delete(profilController.deleteRoute);
router.route('/:uid/route/:rowId').put(profilController.putRoute);
router.route('/:uid/menu').post(profilController.postMenu);
router.route('/:uid/menu/:rowId').get(profilController.getMenu);
router.route('/:uid/menu/:rowId').delete(profilController.deleteMenu);
router.route('/:uid/menu/:rowId').put(profilController.putMenu);

module.exports = router;