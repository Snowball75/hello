// import React from "react";
// import AdminTable from "./components/AdminTable";

// function App() {
//     return (
//         <div className="App">
//             <AdminTable />
//         </div>
//     );
// }

// export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectCompanyType from './components/SelectCompanyType';
import CompanyDetailsForm from './components/CompanyDetailsForm';
import DirectorsForm from './components/DirectorsForm';
import ShareholdersForm from './components/ShareholdersForm'
import CapitalForm from './components/CapitalForm';
import Success from './components/Success';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                 <Route path="/" element={<SelectCompanyType />} />
                <Route path="/form2" element={<CompanyDetailsForm />} />
                <Route path="/directors-form" element={<DirectorsForm/>}/>
                <Route path="/shareholders-form" element={<ShareholdersForm/>}/>
                <Route path="/capital-form" element={<CapitalForm/>}/>
                <Route path='/success' element={<Success/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
