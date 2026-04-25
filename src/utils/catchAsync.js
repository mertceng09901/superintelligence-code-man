// Tüm asenkron fonksiyonları sararak hataları otomatik yakalar ve Express'in hata yöneticisine iletir
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;