import { useState } from "react";
import Button from "../../../components/buttons/button";

const AddProductPage = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ productName, price, description });
    // Add your logic to send the data to the backend
  };

  return (
    <div className="p-6 mx-auto mt-10 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <Button
          buttonName={"Add Product"}
          handleOnClick={handleSubmit}
          className={""}
        />
      </form>
    </div>
  );
};

export default AddProductPage;
