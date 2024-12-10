import React from 'react'
import TaxDefinitionsTabel from './TaxDefinitionsTabel';

const TaxDefinitions = () => {

    const empSalary = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        taxType: "NHIS",
        value: "15",

    }));

    return (
        <div>
            <TaxDefinitionsTabel employees={empSalary} />
        </div>
    )
}

export default TaxDefinitions;