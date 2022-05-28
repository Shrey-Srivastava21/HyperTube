import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className="not_found_container">
            <div>{t('notFound.sorry')}</div>
            <div>
            {t('notFound.notfound')}
            </div>
        </div>
    );
};

export default NotFound;