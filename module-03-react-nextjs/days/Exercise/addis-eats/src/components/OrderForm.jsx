import {useState} from 'react';

function OrderForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        area: "Summit   ",
    });

function handeleChange(e){
    const{name, value} = e.target;
        setForm({
            ...form, //SPREAD
            [name]: value,
        })
    }

function handleSubmit(e){
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)){
            alert("Invalid phone")
    }

    console.log(form);
    alert("Submitted");
}

  return (
    <div>
        <h2>Customer information</h2>
        <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
        name='name' 
        type="text"
        value={form.name}
        onChange={handeleChange}
        placeholder='Your Name'
        />
        <br />
        <label>Phone: </label>
        <input 
        name='phone'
        type="text"
        value={form.price}
        onChange={handeleChange}
        placeholder='Your Phone'
        />
        <br />
       <select name='area' value={form.area} onChange={handeleChange}>
        <option value="Summit">Summit</option>
        <option value="Gerji">Gerji</option>
        <option value="Ayat">Ayat</option>
        <option value="Bole">Bole</option>
       </select>
       <br />
       <button type='submit'>Submit</button>
        </form>
        
    </div>
  )
}
export default OrderForm
