package com.vaultiq.repository;

import com.vaultiq.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findAllByOrderByDateDesc();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'INCOME'")
    Double totalIncome();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE'")
    Double totalExpense();

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t WHERE t.type = 'EXPENSE' GROUP BY t.category.name")
    List<Object[]> expenseByCategory();
}
