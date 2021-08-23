package rest

import (
	"github.com/gorilla/mux"

	"github.com/cosmos/cosmos-sdk/client"
	// this line is used by starport scaffolding # 1
)

const (
	MethodGet = "GET"
)

// RegisterRoutes registers dpnm-related REST handlers to a router
func RegisterRoutes(clientCtx client.Context, r *mux.Router) {
	// this line is used by starport scaffolding # 2
	registerQueryRoutes(clientCtx, r)
	registerTxHandlers(clientCtx, r)

}

func registerQueryRoutes(clientCtx client.Context, r *mux.Router) {
	// this line is used by starport scaffolding # 3
	r.HandleFunc("/dpnm/cbdcs/{id}", getCbdcHandler(clientCtx)).Methods("GET")
	r.HandleFunc("/dpnm/cbdcs", listCbdcHandler(clientCtx)).Methods("GET")

}

func registerTxHandlers(clientCtx client.Context, r *mux.Router) {
	// this line is used by starport scaffolding # 4
	r.HandleFunc("/dpnm/cbdcs", createCbdcHandler(clientCtx)).Methods("POST")
	r.HandleFunc("/dpnm/cbdcs/{id}", updateCbdcHandler(clientCtx)).Methods("POST")
	r.HandleFunc("/dpnm/cbdcs/{id}", deleteCbdcHandler(clientCtx)).Methods("POST")

}
