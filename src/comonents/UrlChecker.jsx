import React, { useState } from 'react';

const UrlChecker = () => {
    const [urlInput, setUrlInput] = useState('');
    const [requirements, setRequirements] = useState([false, false, false, false, false, false]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlInputChange = (e) => {
        setUrlInput(e.target.value);
    };

    const handleRequirementChange = (index) => {
        const newRequirements = [...requirements];
        newRequirements[index] = !newRequirements[index];
        setRequirements(newRequirements);
    };

    const checkUrls = () => {
        const urls = urlInput
            .split(/[\n,]+/)
            .map(url => url.trim())
            .filter(url => url);

        const simulatedResults = urls.map((url, index) => ({
            url,
            status: index % 2 === 0 ? 'PASS' : 'FAIL',
            reason: index % 2 !== 0 ? 'Ошибка в требовании' : null,
        }));

        setResults(simulatedResults);
    };

    async function check() {
        setIsLoading(true);
        
        try {
            let result = await fetch("http://192.168.0.10:8000/api/check", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    requirements,
                    urlInput.split(/[\n,]/).map(url=>url.trim()).filter(url=>url),
                )
            });
            result = JSON.parse(result);
            setResults(result);

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div style={{ display: 'flex', padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7fc', minHeight: '100vh', fontSize: "1.5rem" }}>
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginRight: '20px' }}>
                <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>ССЫЛКИ</h3>
                <textarea
                    value={urlInput}
                    onChange={handleUrlInputChange}
                    placeholder="Введите URL, разделенные запятыми или с новой строки"
                    style={{
                        width: '100%',
                        height: '150px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '1.2rem',
                        marginBottom: '20px',
                        fontFamily: 'Arial, sans-serif',
                        backgroundColor: '#f9f9f9',
                        resize: 'none',
                    }}
                />
                <div className="checkbox-group" style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>Требования</h3>
                    {[ 
                        "1. Наименование совпадает с ТЗ/контрактом", 
                        "2. Если требуется обеспечение — указано в ТЗ/контракте", 
                        "3. Сертификаты/лицензии в наличии или отсутствуют по правилам", 
                        "4. График и этап поставки совпадают с ТЗ/контрактом", 
                        "5. Цена совпадает с проектом контракта/ТЗ", 
                        "6. Проверка ТЗ на соответствие характеристик и количества" 
                    ].map((label, index) => (
                        <label key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '1.25rem', color: '#333' }}>
                            <input
                                type="checkbox"
                                checked={requirements[index]}
                                onChange={() => handleRequirementChange(index)}
                                style={{ marginRight: '10px', height: "1.5rem", width: "1.5rem"}}
                            />
                            {label}
                        </label>
                    ))}
                </div>
                <button 
                    onClick={checkUrls} 
                    style={{
                        padding: '12px 20px',
                        fontSize: '1.5rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Проверить
                </button>
            </div>

            <div className="right" style={{ flex: 1, paddingLeft: '20px', marginTop: '20px', borderLeft: '2px solid #ddd', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
                {
                    isLoading ? <div>Loading...</div> : <>
                        <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>Результаты:</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {results.map((result, index) => (
                        <li
                            key={index}
                            style={{
                                color: result.status === 'PASS' ? 'green' : 'red',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                fontSize: '1rem',
                                backgroundColor: result.status === 'PASS' ? '#e8f5e9' : '#fbe9e7',
                                padding: '10px',
                                borderRadius: '6px',
                                
                            }}
                        >
                            {result.url} - {result.status === "PASS" ? "УСПЕШНО" : "НЕ ПРОШЕЛ"} {result.status === 'FAIL' && `: ${result.reason}`}
                        </li>
                    ))}
                </ul>   
                    </>
                }
            </div>
        </div>
    );
};

export default UrlChecker;
