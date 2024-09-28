"use client";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RestaurantTable,
} from "@/components";
import { useEffect, useRef, useState } from "react";
import { TabPanel, Tabs } from "react-tabs";
import { useOrderStore } from "@/store/order-store";
import {
  Color,
  Floor,
  IconButtonShape,
  Order,
  Product,
  Size,
  Variant,
} from "@/interfaces";
import { InvoicePrint } from "./OrderForm/InvoicePrint";
import { useReactToPrint } from "react-to-print";
import { useGlobalStore } from "@/store/global-store";
import { useUiStore } from "@/store/ui-store";
import { formatCurrency } from "@/utils";
import productsData from "@/data/products.json";

interface Props {
  floors: Floor[];
}

export const OrderTables = ({ floors }: Props) => {
  const [tabFloorIndex, setTabFloorIndex] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]); // Estado para almacenar las órdenes
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Orden seleccionada para imprimir
  const { updateTrigger } = useGlobalStore();
  const { activeModal, openModal, closeModal } = useUiStore(); // Destructurar funciones del UI store

  const [searchTerm, setSearchTerm] = useState(""); // For the search input
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchProductQuantities, setSearchProductQuantities] = useState<{
    [key: string]: number;
  }>({});

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing || filteredProducts.length > 0) {
      searchResultsRef.current?.scrollIntoView({ behavior: "smooth" });
      if (isEditing) {
        searchInputRef.current?.focus();
      }
    }
  }, [isEditing, filteredProducts]);

  const {
    setSelectedFloorId,
    setSelectedFloorName,
    selectedTableId,
    setSelectedTableId,
    setSelectedTableNumber,
  } = useOrderStore();

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Invoice",
    onAfterPrint: () => {
      if (selectedOrder) {
        releaseTable(selectedOrder.tableId);
      }
    },
  });

  // Recuperar órdenes de localStorage al cargar el componente
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, [updateTrigger]);

  // Seleccionar la planta al inicio
  useEffect(() => {
    if (floors.length > 0) {
      setSelectedFloorId(floors[0].id || null);
      setSelectedFloorName(floors[0].name || null);
    }
  }, [floors, setSelectedFloorId, setSelectedFloorName]);

  const releaseTable = (tableId: string) => {
    const updatedOrders = orders.filter((order) => order.tableId !== tableId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Actualizar localStorage
    setSelectedOrder(null); // Limpiar la orden seleccionada
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.length >= 3) {
      const filtered = productsData.flatMap((product) => {
        const matchesName = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory = product.category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (matchesName || matchesCategory) {
          if (product.variations.length > 0) {
            return product.variations.flatMap((variation) => {
              if (variation.hasPrice) {
                return variation.options.map((option) => ({
                  ...product,
                  name: `${product.name} - ${variation.name}: ${option.name}`, // Nombre con variación
                  price: (option as { price: number }).price, // Precio de la opción
                  variationOptionId: option.id, // ID de la opción
                }));
              } else {
                // Si no tiene precio, solo el producto con su nombre y precio
                return [
                  {
                    ...product,
                    name: product.name, // Solo nombre del producto
                    price: product.price, // Precio del producto
                    variationOptionId: "", // Opción vacía, ya que no hay variación
                  },
                ];
              }
            });
          } else {
            // Si no hay variaciones, retorna el producto
            return [
              {
                ...product,
                name: product.name, // Solo el nombre del producto
                price: product.price, // Precio del producto
                variationOptionId: "", // Opción vacía
              },
            ];
          }
        }
        return [];
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const addProductToOrder = (product: Product) => {
    if (selectedOrder) {
      const quantityToAdd = searchProductQuantities[product.id] || 1; // Obtén la cantidad del estado del contador

      if (quantityToAdd > 0) {
        // Solo agrega si la cantidad es mayor que 0
        // Buscar si el producto o variación ya existe en la orden
        const existingProduct = selectedOrder.orderProducts.find(
          (item) =>
            item.id === product.id &&
            item.variationOptionId === product.variationOptionId
        );

        let updatedOrder;

        if (existingProduct) {
          // Si ya existe, incrementar la cantidad
          updatedOrder = {
            ...selectedOrder,
            orderProducts: selectedOrder.orderProducts.map((item) =>
              item.id === product.id &&
              item.variationOptionId === product.variationOptionId
                ? {
                    ...item,
                    quantity: (item.quantity || 0) + quantityToAdd,
                    subtotal:
                      (item.subtotal || 0) + product.price * quantityToAdd,
                  }
                : item
            ),
            total: selectedOrder.total + product.price * quantityToAdd,
          };
        } else {
          // Si no existe, agregarlo como un nuevo producto
          updatedOrder = {
            ...selectedOrder,
            orderProducts: [
              ...selectedOrder.orderProducts,
              {
                ...product,
                id: product.id,
                name: product.name,
                quantity: quantityToAdd,
                subtotal: product.price * quantityToAdd,
                isNew: true,
              },
            ],
            total: selectedOrder.total + product.price * quantityToAdd,
          };
        }

        setSelectedOrder(updatedOrder);

        // Limpiar el searchTerm después de agregar el producto
        setSearchTerm("");
        setIsEditing(false);
        setFilteredProducts([]);
        setSearchProductQuantities({}); // Limpiar las cantidades después de agregar

        // Actualizar la lista de órdenes
        const updatedOrders = orders.map((order) =>
          order.tableId === selectedOrder.tableId ? updatedOrder : order
        );
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Actualizar localStorage
      }
    }
  };

  const removeProductFromOrder = (
    productId: string,
    variationOptionId?: string
  ) => {
    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        orderProducts: selectedOrder.orderProducts.filter(
          (item) =>
            item.id !== productId ||
            item.variationOptionId !== variationOptionId
        ),
        total: selectedOrder.orderProducts.reduce(
          (acc, item) => acc + (item.subtotal || 0),
          0
        ),
      };

      setSelectedOrder(updatedOrder);

      const updatedOrders = orders.map((order) =>
        order.tableId === selectedOrder.tableId ? updatedOrder : order
      );
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Actualizar localStorage
    }
  };

  useEffect(() => {
    if (!activeModal || !isEditing) {
      setSearchTerm("");
      setIsEditing(false);
      setFilteredProducts([]);
    }
  }, [activeModal, isEditing]);

  interface QuantityCounterProps {
    currentValue: number; // La cantidad actual del producto
    onIncrease: () => void; // Función para aumentar la cantidad
    onDecrease: () => void; // Función para disminuir la cantidad
    maxItems: number; // Cantidad máxima permitida
  }

  const QuantityCounter: React.FC<QuantityCounterProps> = ({
    currentValue,
    onIncrease,
    onDecrease,
    maxItems,
  }) => {
    return (
      <div className="flex items-center gap-2">
        <IconButton
          size={Size.SM}
          variant={Variant.GHOST}
          shape={IconButtonShape.SQUARE}
          iconName={currentValue === 1 ? "trash" : "minus-small"}
          onClick={onDecrease}
        />
        <span className="min-w-6 text-center">{currentValue}</span>
        <IconButton
          disabled={maxItems === currentValue}
          size={Size.SM}
          variant={Variant.GHOST}
          shape={IconButtonShape.SQUARE}
          iconName="plus-small"
          onClick={onIncrease}
        />
      </div>
    );
  };

  return (
    <div>
      <Tabs
        selectedIndex={tabFloorIndex}
        onSelect={(index) => {
          setTabFloorIndex(index);
          setSelectedFloorId(floors[index].id || null);
        }}
      >
        {floors.map((floor) => (
          <TabPanel key={floor.id}>
            <div className="flex flex-1 flex-col p-4 md:p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-4 md:gap-6">
                {floor.tables.map((table) => {
                  const isTableOccupied = orders.some(
                    (order) => order.tableId === table.id
                  );
                  const orderForTable = orders.find(
                    (order) => order.tableId === table.id
                  );

                  return (
                    <div
                      key={table.id}
                      className="flex items-center justify-center aspect-square cursor-pointer"
                      onClick={() => {
                        if (isTableOccupied && orderForTable) {
                          setSelectedOrder(orderForTable); // Establecer la orden seleccionada
                          openModal(); // Abre el modal desde el UiStore
                          setSelectedTableId("");
                          setSelectedTableNumber("");
                        } else {
                          setSelectedTableId(table.id || "");
                          setSelectedTableNumber(table.number || "");
                        }
                      }}
                    >
                      <div className="relative flex items-center justify-center w-16 h-16 md:h-24 md:w-24">
                        <span
                          className={`relative z-20 text-lg font-bold ${
                            selectedTableId === table.id
                              ? "text-white"
                              : isTableOccupied
                              ? "text-white"
                              : "text-gray600"
                          }`}
                        >
                          {table.number}
                        </span>
                        <RestaurantTable
                          className={`w-20 h-20 md:w-24 md:h-24 absolute z-10 transition-all ${
                            selectedTableId === table.id
                              ? "fill-accent"
                              : isTableOccupied
                              ? "fill-error"
                              : "fill-gray100"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedOrder &&
                activeModal && ( // Renderiza el modal si hay una orden seleccionada y el modal está activo
                  <Modal isOpen size={Size._2XL}>
                    <ModalHeader>
                      <div className="w-full flex gap-4 items-center">
                        <div className="flex w-full md:w-auto items-center gap-2">
                          <div className="block xl:hidden">
                            <IconButton
                              iconName="arrow-left"
                              size={Size.SM}
                              onClick={() => closeModal()}
                            />
                          </div>
                          <h1 className="w-full flex-1 text-base md:text-xl leading-tight font-semibold text-ellipsis text-nowrap overflow-hidden">{`Órden #${selectedOrder.orderNumber}`}</h1>
                        </div>
                      </div>
                    </ModalHeader>
                    <ModalBody>
                      <div className="pb-16 md:pb-0">
                        <div className="rounded border border-gray100 mb-4">
                          <table className="w-full">
                            <thead className="text-sm leading-3">
                              <tr>
                                <th className="py-4 px-2 pl-4 border-b text-left border-gray50 w-1"></th>
                                <th className="py-4 px-2 border-b text-left border-gray50">
                                  Producto
                                </th>
                                <th className="py-4 px-2 border-b text-right border-gray50">
                                  Subtotal
                                </th>
                                <th className="py-4 px-2 border-b text-right border-gray50 w-1"></th>
                              </tr>
                            </thead>
                            <tbody className="leading-[1.125em]">
                              {selectedOrder.orderProducts.map((item) => (
                                <tr key={item.id}>
                                  <td className="align-text-top p-2 pl-4">
                                    x{item.quantity}
                                  </td>
                                  <td className="align-text-top p-2">
                                    <div className="mb-1">{item.name}</div>
                                  </td>
                                  <td className="align-text-top text-right p-2 text-nowrap">
                                    {formatCurrency(item.subtotal || 0)}
                                  </td>
                                  <td className="align-text-top text-right p-2 text-nowrap">
                                    {item.isNew && (
                                      <IconButton
                                        iconName="cross-small"
                                        variant={Variant.GHOST}
                                        color={Color.ERROR}
                                        size={Size.SM}
                                        onClick={() =>
                                          removeProductFromOrder(
                                            item.id,
                                            item.variationOptionId
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-right p-4 border-t border-t-gray100 text-accent text-base md:text-xl"
                                >
                                  <strong>
                                    Total: {formatCurrency(selectedOrder.total)}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {isEditing && (
                          <div className="mt-4 relative" ref={searchResultsRef}>
                            <input
                              type="text"
                              placeholder="Buscar producto o categoría..."
                              value={searchTerm}
                              onChange={handleSearch}
                              className="px-4 py-3 border border-gray300 rounded w-full"
                              ref={searchInputRef}
                            />
                            {filteredProducts.length > 0 && (
                              <ul className="bg-gray50 w-full mt-1 rounded">
                                {filteredProducts.map((product) => (
                                  <li
                                    key={product.id}
                                    className="py-2 px-4 gap-4 border-b border-b-gray200 last:border-none cursor-pointer hover:bg-gray100 flex items-center justify-between"
                                  >
                                    <div>
                                      {product.name} -{" "}
                                      {formatCurrency(product.price)}
                                    </div>
                                    <div className="flex-1 flex gap-1 justify-end">
                                      <QuantityCounter
                                        currentValue={
                                          searchProductQuantities[product.id] ||
                                          1
                                        } // Asegúrate de que el valor inicial sea correcto
                                        onIncrease={() =>
                                          setSearchProductQuantities(
                                            (prev) => ({
                                              ...prev,
                                              [product.id]:
                                                (prev[product.id] || 1) + 1, // Aumentar la cantidad correctamente
                                            })
                                          )
                                        }
                                        onDecrease={() =>
                                          setSearchProductQuantities((prev) => {
                                            const currentQuantity =
                                              prev[product.id] || 1; // Obtener la cantidad actual
                                            if (currentQuantity > 1) {
                                              // Cambiar la condición a 1 para evitar que se vuelva 0
                                              return {
                                                ...prev,
                                                [product.id]:
                                                  currentQuantity - 1,
                                              };
                                            }
                                            return prev;
                                          })
                                        }
                                        maxItems={10} // Define la cantidad máxima si es necesario
                                      />
                                      <div>
                                        <IconButton
                                          iconName="plus-small"
                                          variant={Variant.GHOST}
                                          color={Color.SUCCESS}
                                          onClick={() =>
                                            addProductToOrder(product)
                                          }
                                          size={Size.SM}
                                        />
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <div className="flex flex-wrap gap-4 w-full">
                        <Button
                          text="Liberar"
                          variant={Variant.CONTAINED}
                          size={Size.LG}
                          onClick={() => releaseTable(selectedOrder.tableId)}
                          className="flex-1"
                        />
                        <Button
                          text="Editar"
                          variant={Variant.CONTAINED}
                          size={Size.LG}
                          onClick={() => setIsEditing(!isEditing)} // Toggle editing mode
                          className="flex-1"
                        />
                        <Button
                          text="Cobrar"
                          variant={Variant.CONTAINED}
                          color={Color.ACCENT}
                          size={Size.LG}
                          onClick={handlePrint}
                          full
                        />
                      </div>
                    </ModalFooter>
                  </Modal>
                )}
              <div style={{ display: "none" }}>
                {selectedOrder && (
                  <InvoicePrint
                    ref={componentRef}
                    orderData={{
                      orderNumber: selectedOrder.orderNumber,
                      order: selectedOrder.orderProducts,
                      floor: selectedOrder.floor,
                      table: selectedOrder.table,
                      total: selectedOrder.total,
                      orderType: selectedOrder.orderType,
                      client: selectedOrder.client,
                    }}
                  />
                )}
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
