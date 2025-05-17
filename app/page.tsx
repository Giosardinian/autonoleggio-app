"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AutonoleggioApp() {
    const [searchTerm, setSearchTerm] = useState('');
    const [contracts, setContracts] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [clients, setClients] = useState([]);
    const [vehicle, setVehicle] = useState({ plate: '', model: '', mileage: '', type: '', priceType: 'giornaliero', price: '', notes: '' });
    const [client, setClient] = useState({ name: '', phone: '', address: '', city: '', documentId: '', driverLicense: '', licenseExpiry: '', licenseIssueDate: '', licenseIssuer: '', billingCompany: '' });
    const [contract, setContract] = useState({
        vehicle: '',
        client: '',
        contractNumber: '',
        openDate: '',
        openTime: '',
        accessories: '',
        fuelLevelOut: '',
        kmOut: '',
        rentalRateType: 'giornaliero',
        rentalRate: '',
        rentalDays: '',
        kmLimit: '',
        kmExtraRate: '',
        contractEndDate: '',
        contractEndTime: '',
        depositAmount: '',
        depositMethod: '',
        returnDate: '',
        returnTime: '',
        kmReturn: '',
        fuelLevelReturn: '',
        fuelMissing: '',
        damages: '',
        depositReturnDate: '',
        depositReturnMethod: '',
        depositReturnAmount: '',
        discount: '',
        notes: ''
    });
    const [editVehicleIndex, setEditVehicleIndex] = useState(null);
    const [editClientIndex, setEditClientIndex] = useState(null);

    const addOrUpdateVehicle = () => {
        if (vehicle.plate && vehicle.model && vehicle.mileage) {
            const updatedVehicles = [...vehicles];
            if (editVehicleIndex !== null) {
                updatedVehicles[editVehicleIndex] = vehicle;
                setEditVehicleIndex(null);
                alert('Veicolo aggiornato con successo!');
            } else {
                updatedVehicles.push(vehicle);
                alert('Veicolo aggiunto con successo!');
            }
            setVehicles(updatedVehicles);
            setVehicle({ plate: '', model: '', mileage: '', type: '', priceType: 'giornaliero', price: '', notes: '' });
        } else {
            alert('Compila tutti i campi del veicolo.');
        }
    };

    const addOrUpdateClient = () => {
        const { name, phone, address, city, documentId, driverLicense, licenseExpiry, licenseIssueDate, licenseIssuer, billingCompany } = client;
        if (!name || !phone || !address || !city || !documentId || !driverLicense || !licenseExpiry || !licenseIssueDate || !licenseIssuer || !billingCompany) {
            alert('Compila tutti i campi del cliente.');
            return;
        }

        const expiryDate = new Date(licenseExpiry);
        const issueDate = new Date(licenseIssueDate);

        if (issueDate >= expiryDate) {
            alert('La data di rilascio della patente non può essere successiva o uguale alla data di scadenza.');
            return;
        }

        const updatedClients = [...clients];
        if (editClientIndex !== null) {
            updatedClients[editClientIndex] = client;
            setEditClientIndex(null);
            alert('Cliente aggiornato con successo!');
        } else {
            updatedClients.push(client);
            alert('Cliente aggiunto con successo!');
        }
        setClients(updatedClients);
        setClient({ name: '', phone: '', address: '', city: '', documentId: '', driverLicense: '', licenseExpiry: '', licenseIssueDate: '', licenseIssuer: '', billingCompany: '' });
    };

    return (
        <div className="p-4 grid gap-4">
            <h1 className="text-2xl font-bold mb-6">Autonoleggio App</h1>

            <Input placeholder="Cerca veicoli, clienti o contratti" onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} className="mb-4 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full" />
            
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Gestione Veicoli</h2>
                    <Input placeholder="Targa" value={vehicle.plate} onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })} />
                    <Input placeholder="Modello" value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} />
                    <Input placeholder="KM Uscita" value={vehicle.mileage} onChange={(e) => setVehicle({ ...vehicle, mileage: e.target.value })} />
                    <Button onClick={addOrUpdateVehicle} className="mt-2">{editVehicleIndex !== null ? 'Aggiorna Veicolo' : 'Aggiungi Veicolo'}</Button>

                    <Input placeholder="Sconto (opzionale)" value={contract.discount} onChange={(e) => setContract({ ...contract, discount: e.target.value })} className="mb-2" />
                    <div className="mb-4 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-bold mb-2">Riepilogo Totale</h3>
                        <p>Tariffa Noleggio: {contract.rentalRate} €</p>
                        <p>Giorni di Noleggio: {contract.rentalDays}</p>
                        <p>Limite KM Incluso: {contract.kmLimit}</p>
                        <p>Tariffa per KM Extra: {contract.kmExtraRate} €</p>
                        <p>KM Uscita: {contract.kmOut}</p>
                        <p>KM Rientro: {contract.kmReturn || 'Non ancora inserito'}</p>
                        <p>Carburante Mancante: {contract.fuelMissing || 0} Litri</p>
                        <p>Danni: {contract.damages ? 'Presenti' : 'Nessuno'}</p>
                        <p>Sconto: {contract.discount || 0} €</p>
                        <p className="font-bold text-xl mt-2">Totale Stimato: €{(() => {
                            const rentalDays = parseInt(contract.rentalDays) || 0;
                            const rentalRate = parseFloat(contract.rentalRate) || 0;
                            const kmLimit = parseInt(contract.kmLimit) || 0;
                            const kmExtraRate = parseFloat(contract.kmExtraRate) || 0;
                            const kmOut = parseInt(contract.kmOut) || 0;
                            const kmReturn = parseInt(contract.kmReturn) || kmOut;
                            const fuelMissingCost = parseFloat(contract.fuelMissing || 0) * 2;
                            const damageCost = contract.damages ? 100 : 0;
                            const discount = parseFloat(contract.discount || 0);

                            let totalCost = rentalDays * rentalRate;
                            const kmDriven = kmReturn - kmOut;
                            const totalKmLimit = kmLimit * rentalDays;

                            if (kmDriven > totalKmLimit) {
                                const extraKm = kmDriven - totalKmLimit;
                                totalCost += extraKm * kmExtraRate;
                            }

                            totalCost += fuelMissingCost + damageCost;
                            totalCost -= discount;

                            return totalCost.toFixed(2);
                        })()}</p>
                    </div>
                    <Textarea placeholder="Note Extra (opzionale)" value={contract.notes} onChange={(e) => {
                        const forbiddenWords = ['password', 'codice fiscale', 'carta di credito', 'iban', 'iban', 'ccv', 'cvv', 'numero di conto', 'pin'];
                        const noteValue = e.target.value.toLowerCase();
                        const containsForbiddenWords = forbiddenWords.some(word => noteValue.includes(word));
                        if (containsForbiddenWords) {
                            alert('Le note non possono contenere informazioni sensibili come password, codice fiscale o dati bancari.');
                            return;
                        }
                        setContract({ ...contract, notes: e.target.value });
                    }} className="mb-2" />
                    <Button onClick={() => {
                        const filteredContracts = contracts.filter(c =>
                            c.contractNumber.toLowerCase().includes(searchTerm) ||
                            c.client.toLowerCase().includes(searchTerm) ||
                            c.vehicle.toLowerCase().includes(searchTerm) ||
                            c.notes.toLowerCase().includes(searchTerm)
                        );
                        const data = filteredContracts.map(c => ({
                            NumeroContratto: c.contractNumber,
                            Cliente: c.client,
                            Veicolo: c.vehicle,
                            DataApertura: c.openDate,
                            DataChiusura: c.contractEndDate,
                            Totale: c.totalCost || 'N/A',
                            Note: c.notes || 'Nessuna'
                        }));

                        const csvContent = [
                            Object.keys(data[0]).join(','),
                            ...data.map(row => Object.values(row).join(','))
                        ].join('\n');

                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'contratti_noleggio.csv';
                        link.click();
                        URL.revokeObjectURL(link.href);

                        alert('Esportazione CSV completata con successo!');
                    }} className="mt-2 bg-blue-500 text-white">Esporta Contratti in CSV</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Chiusura Contratto</h2>
                    <Input placeholder="Data di Rientro" type="date" value={contract.returnDate} onChange={(e) => setContract({ ...contract, returnDate: e.target.value })} className="mb-2" />
                    <Input placeholder="Ora di Rientro" type="time" value={contract.returnTime} onChange={(e) => setContract({ ...contract, returnTime: e.target.value })} className="mb-2" />
                    <Input placeholder="KM Rientro" value={contract.kmReturn} onChange={(e) => setContract({ ...contract, kmReturn: e.target.value })} className="mb-2" />
                    <select value={contract.fuelLevelReturn} onChange={(e) => setContract({ ...contract, fuelLevelReturn: e.target.value })} className="mb-2 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full">
                        <option value="">Livello Carburante in Rientro</option>
                        <option value="R">R</option>
                        <option value="1/4">1/4</option>
                        <option value="1/2">1/2</option>
                        <option value="3/4">3/4</option>
                        <option value="Pieno">Pieno</option>
                    </select>
                    <Input placeholder="Gasolio Mancante (Litri)" value={contract.fuelMissing} onChange={(e) => setContract({ ...contract, fuelMissing: e.target.value })} className="mb-2" />
                    <Textarea placeholder="Eventuali Danni o Mancanze" value={contract.damages} onChange={(e) => setContract({ ...contract, damages: e.target.value })} className="mb-2" />
                    <Input placeholder="Data Ritiro Deposito Cauzionale" type="date" value={contract.depositReturnDate} onChange={(e) => setContract({ ...contract, depositReturnDate: e.target.value })} className="mb-2" />
                    <Input placeholder="Metodo Ritiro Deposito Cauzionale" value={contract.depositReturnMethod} onChange={(e) => setContract({ ...contract, depositReturnMethod: e.target.value })} className="mb-2" />
                    <Input placeholder="Importo Ritiro Deposito Cauzionale" value={contract.depositReturnAmount} onChange={(e) => setContract({ ...contract, depositReturnAmount: e.target.value })} className="mb-2" />
                    <Button onClick={() => alert('Chiusura contratto registrata con successo!')} className="mt-2 bg-green-500 text-white">Conferma Chiusura Contratto</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Gestione Clienti</h2>
                    <Input placeholder="Nome e Cognome" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
                    <Input placeholder="Telefono" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
                    <Input placeholder="Indirizzo" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
                    <Button onClick={addOrUpdateClient} className="mt-2">{editClientIndex !== null ? 'Aggiorna Cliente' : 'Aggiungi Cliente'}</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Gestione Contratti</h2>
                    <Input placeholder="Numero Contratto" value={contract.contractNumber} onChange={(e) => setContract({ ...contract, contractNumber: e.target.value })} className="mb-2" />
                    <Input placeholder="Data di Apertura" type="date" value={contract.openDate} onChange={(e) => setContract({ ...contract, openDate: e.target.value })} className="mb-2" />
                    <Input placeholder="Ora di Apertura" type="time" value={contract.openTime} onChange={(e) => setContract({ ...contract, openTime: e.target.value })} className="mb-2" />
                    <select value={contract.client} onChange={(e) => setContract({ ...contract, client: e.target.value })} className="mb-2 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full">
                        <option value="">Seleziona Cliente</option>
                        {clients.filter(c => c.name.toLowerCase().includes(searchTerm) || c.phone.toLowerCase().includes(searchTerm) || c.billingCompany.toLowerCase().includes(searchTerm)).map((c, index) => (
                            <option key={index} value={c.name}>{c.name} - {c.phone}</option>
                        ))}
                    </select>
                    <select value={contract.vehicle} onChange={(e) => setContract({ ...contract, vehicle: e.target.value })} className="mb-2 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full">
                        <option value="">Seleziona Veicolo</option>
                        {vehicles.filter(v => v.plate.toLowerCase().includes(searchTerm) || v.model.toLowerCase().includes(searchTerm) || v.notes.toLowerCase().includes(searchTerm)).map((v, index) => (
                            <option key={index} value={v.plate}>{v.plate} - {v.model}</option>
                        ))}
                    </select>
                    <Textarea placeholder="Accessori Inclusi" value={contract.accessories} onChange={(e) => setContract({ ...contract, accessories: e.target.value })} className="mb-2" />
                    <select value={contract.fuelLevelOut} onChange={(e) => setContract({ ...contract, fuelLevelOut: e.target.value })} className="mb-2 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full">
                        <option value="">Livello Carburante in Uscita</option>
                        <option value="R">R</option>
                        <option value="1/4">1/4</option>
                        <option value="1/2">1/2</option>
                        <option value="3/4">3/4</option>
                        <option value="Pieno">Pieno</option>
                    </select>
                    <Input placeholder="KM Uscita" value={contract.kmOut} onChange={(e) => setContract({ ...contract, kmOut: e.target.value })} className="mb-2" />
                    <select value={contract.rentalRateType} onChange={(e) => setContract({ ...contract, rentalRateType: e.target.value })} className="mb-2 border-2 border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none w-full">
                        <option value="giornaliero">Tariffa Giornaliera</option>
                        <option value="mensile">Tariffa Mensile</option>
                    </select>
                    <Input placeholder="Tariffa Noleggio" value={contract.rentalRate} onChange={(e) => setContract({ ...contract, rentalRate: e.target.value })} className="mb-2" />
                    <Input placeholder="Giorni di Noleggio" value={contract.rentalDays} onChange={(e) => setContract({ ...contract, rentalDays: e.target.value })} className="mb-2" />
                    <Input placeholder="Limite KM Incluso" value={contract.kmLimit} onChange={(e) => setContract({ ...contract, kmLimit: e.target.value })} className="mb-2" />
                    <Input placeholder="Tariffa per KM Extra" value={contract.kmExtraRate} onChange={(e) => setContract({ ...contract, kmExtraRate: e.target.value })} className="mb-2" />
                    <Input placeholder="Data di Scadenza Contratto" type="date" value={contract.contractEndDate} onChange={(e) => setContract({ ...contract, contractEndDate: e.target.value })} className="mb-2" />
                    <Input placeholder="Ora di Scadenza Contratto" type="time" value={contract.contractEndTime} onChange={(e) => setContract({ ...contract, contractEndTime: e.target.value })} className="mb-2" />
                    <Input placeholder="Deposito Cauzionale" value={contract.depositAmount} onChange={(e) => setContract({ ...contract, depositAmount: e.target.value })} className="mb-2" />
                    <Input placeholder="Metodo Deposito Cauzionale" value={contract.depositMethod} onChange={(e) => setContract({ ...contract, depositMethod: e.target.value })} className="mb-2" />
                    <Button onClick={() => {
                        const contractPreview = `CONTRATTO DI NOLEGGIO

Numero Contratto: ${contract.contractNumber}
Cliente: ${contract.client}
Veicolo: ${contract.vehicle}
Data di Apertura: ${contract.openDate} ${contract.openTime}
Data di Scadenza: ${contract.contractEndDate} ${contract.contractEndTime}
Accessori Inclusi: ${contract.accessories}
Carburante in Uscita: ${contract.fuelLevelOut}
KM Uscita: ${contract.kmOut}
Tariffa: ${contract.rentalRate} € (${contract.rentalRateType})
Giorni di Noleggio: ${contract.rentalDays}
Limite KM Incluso: ${contract.kmLimit}
Tariffa per KM Extra: ${contract.kmExtraRate} €

Deposito Cauzionale: ${contract.depositAmount} € (${contract.depositMethod})

CONDIZIONI CONTRATTUALI:

1. Il Cliente si impegna a riconsegnare il veicolo nelle medesime condizioni in cui è stato consegnato.
2. Il noleggiatore non è responsabile per danni causati dall'uso improprio del veicolo.
3. Il carburante consumato è a carico del Cliente.
4. Le multe e le infrazioni durante il periodo di noleggio sono a carico del Cliente.
5. In caso di danni, il Cliente è responsabile per l'intero importo del danno.
6. Il contratto è soggetto alle leggi italiane.
7. Il deposito cauzionale sarà restituito solo dopo verifica delle condizioni del veicolo.
8. In caso di controversie, è competente il foro di Cagliari.

Firma del Cliente: ______________________
Firma del Noleggiatore: ______________________

Data: ${new Date().toLocaleDateString()}`;

                        alert(`Anteprima Contratto:\n\n${contractPreview}`);
                    }} className="mt-2 bg-blue-500 text-white">Anteprima Contratto</Button>
                    <Button onClick={() => {
                        if (window.confirm('Sei sicuro di voler creare e stampare questo contratto?')) {
                            const rentalDays = parseInt(contract.rentalDays);
                            const rentalRate = parseFloat(contract.rentalRate);
                            const kmLimit = parseInt(contract.kmLimit);
                            const kmExtraRate = parseFloat(contract.kmExtraRate);
                            const kmOut = parseInt(contract.kmOut);
                            const kmReturn = parseInt(contract.kmReturn) || kmOut;
                            const fuelMissingCost = parseFloat(contract.fuelMissing || 0) * 2;
                            const damageCost = contract.damages ? 100 : 0;
                            const discount = parseFloat(contract.discount || 0);

                            let totalCost = rentalDays * rentalRate;
                            const kmDriven = kmReturn - kmOut;
                            const totalKmLimit = kmLimit * rentalDays;

                            if (kmDriven > totalKmLimit) {
                                const extraKm = kmDriven - totalKmLimit;
                                totalCost += extraKm * kmExtraRate;
                            }

                            totalCost += fuelMissingCost + damageCost;
                            totalCost -= discount;

                            const contractText = `CONTRATTO DI NOLEGGIO

Numero Contratto: ${contract.contractNumber}
Cliente: ${contract.client}
Veicolo: ${contract.vehicle}
Data di Apertura: ${contract.openDate} ${contract.openTime}
Data di Scadenza: ${contract.contractEndDate} ${contract.contractEndTime}
Accessori Inclusi: ${contract.accessories}
Carburante in Uscita: ${contract.fuelLevelOut}
KM Uscita: ${contract.kmOut}
KM Rientro: ${kmReturn}
Tariffa: ${contract.rentalRate} € (${contract.rentalRateType})
Giorni di Noleggio: ${contract.rentalDays}
Limite KM Incluso: ${contract.kmLimit}
Tariffa per KM Extra: ${contract.kmExtraRate} €
Deposito Cauzionale: ${contract.depositAmount} € (${contract.depositMethod})
Sconto Applicato: €${discount.toFixed(2)}
Totale: €${totalCost.toFixed(2)}
Note Extra: ${contract.notes || 'Nessuna'}

CONDIZIONI CONTRATTUALI:

1. Il Cliente si impegna a riconsegnare il veicolo nelle medesime condizioni in cui è stato consegnato.
2. Il noleggiatore non è responsabile per danni causati dall'uso improprio del veicolo.
3. Il carburante consumato è a carico del Cliente.
4. Le multe e le infrazioni durante il periodo di noleggio sono a carico del Cliente.
5. In caso di danni, il Cliente è responsabile per l'intero importo del danno.
6. Il contratto è soggetto alle leggi italiane.
7. Il deposito cauzionale sarà restituito solo dopo verifica delle condizioni del veicolo.
8. In caso di controversie, è competente il foro di Cagliari.

Firma del Cliente: ______________________
Firma del Noleggiatore: ______________________

Data: ${new Date().toLocaleDateString()}`;

                            const blob = new Blob([contractText], { type: 'application/pdf' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `Contratto_${contract.contractNumber}.pdf`;
                            link.click();
                            URL.revokeObjectURL(link.href);
                            alert(`Contratto creato con successo! Totale: €${totalCost.toFixed(2)}\nNote Extra: ${contract.notes || 'Nessuna'}`);
                        }
                    }} className="mt-2 bg-green-500 text-white">Crea Contratto e Stampa</Button>
                </CardContent>
            </Card>
        </div>
    );
}
